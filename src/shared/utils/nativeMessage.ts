import { getDefaultStore } from "jotai";
import { tripReminderEnabledAtom } from "@/shared/store/notificationSettingsStore";

interface TripNotificationMessage {
  type: "TRIP_NOTIFICATION";
  action: "schedule" | "cancel";
  tripId: string;
  tripTitle?: string;
  startDate?: string;
}

interface NotificationPermissionMessage {
  type: "NOTIFICATION_PERMISSION";
  action: "query" | "openSettings";
}

interface HapticMessage {
  type: "HAPTIC";
  style: "light" | "medium" | "heavy" | "success" | "warning" | "error";
}

interface OpenUrlMessage {
  type: "OPEN_URL";
  url: string;
}

interface AppleSignInRequestMessage {
  type: "APPLE_SIGN_IN_REQUEST";
}

interface PremiumPurchaseRequestMessage {
  type: "PREMIUM_PURCHASE_REQUEST";
  userId: string;
  productId?: string;
  /** 요청 상관번호 — 네이티브가 결과에 그대로 실어 회신(늦은 결과 오배달 차단). */
  nonce?: string;
}

interface RestorePurchasesMessage {
  type: "RESTORE_PURCHASES";
  userId: string;
  nonce?: string;
}

type NativeMessage =
  | TripNotificationMessage
  | NotificationPermissionMessage
  | HapticMessage
  | OpenUrlMessage
  | AppleSignInRequestMessage
  | PremiumPurchaseRequestMessage
  | RestorePurchasesMessage;

export interface AppleSignInBridgeResult {
  identityToken: string;
  email: string | null;
  fullName: string | null;
  user: string;
}

interface AppleSignInResultDetail {
  ok: boolean;
  identityToken?: string;
  email?: string | null;
  fullName?: string | null;
  user?: string;
  code?: string;
  message?: string;
}

interface ScheduleData {
  tripId: string;
  tripTitle: string;
  startDate: string;
}

interface CancelData {
  tripId: string;
}

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

function postNativeMessage(message: NativeMessage) {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(JSON.stringify(message));
}

export function scheduleTripNotification(data: ScheduleData) {
  // 전역 리마인더 OFF면 신규 예약을 보내지 않는다 (모든 호출 지점 공통 게이트).
  // 취소는 OFF 상태에서도 나가야 하므로 cancel 쪽엔 게이트를 두지 않는다.
  if (!getDefaultStore().get(tripReminderEnabledAtom)) return;
  postNativeMessage({
    type: "TRIP_NOTIFICATION",
    action: "schedule",
    ...data,
  });
}

export function cancelTripNotification(data: CancelData) {
  postNativeMessage({
    type: "TRIP_NOTIFICATION",
    action: "cancel",
    ...data,
  });
}

/** 기기 알림 권한 상태 요청 — 응답은 "notification-permission-result" CustomEvent */
export function queryNotificationPermission() {
  postNativeMessage({ type: "NOTIFICATION_PERMISSION", action: "query" });
}

/** OS 앱 알림 설정 화면 열기 */
export function openAppNotificationSettings() {
  postNativeMessage({
    type: "NOTIFICATION_PERMISSION",
    action: "openSettings",
  });
}

export function triggerHaptic(
  style: HapticMessage["style"] = "light"
) {
  postNativeMessage({ type: "HAPTIC", style });
}

export function openUrl(url: string) {
  postNativeMessage({ type: "OPEN_URL", url });
}

export function isReactNativeWebView(): boolean {
  return typeof window !== "undefined" && !!window.ReactNativeWebView;
}

/**
 * 외부 URL을 연다.
 * - RN 웹뷰: OPEN_URL 브릿지로 위임 → 네이티브가 외부 브라우저/앱(쿠팡 등)으로 전환
 * - 순수 웹: 새 탭
 */
export function openExternalUrl(url: string) {
  if (isReactNativeWebView()) {
    openUrl(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

const APPLE_SIGN_IN_TIMEOUT_MS = 60_000;

export function requestAppleSignIn(): Promise<AppleSignInBridgeResult> {
  return new Promise((resolve, reject) => {
    if (!isReactNativeWebView()) {
      reject(new Error("Not running inside React Native WebView"));
      return;
    }

    const handleResult = (event: Event) => {
      const detail = (event as CustomEvent<AppleSignInResultDetail>).detail;
      cleanup();
      if (detail?.ok && detail.identityToken) {
        resolve({
          identityToken: detail.identityToken,
          email: detail.email ?? null,
          fullName: detail.fullName ?? null,
          user: detail.user ?? "",
        });
      } else {
        reject(new Error(detail?.message ?? "Apple Sign In failed"));
      }
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Apple Sign In timed out"));
    }, APPLE_SIGN_IN_TIMEOUT_MS);

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("apple-sign-in-result", handleResult);
    };

    window.addEventListener("apple-sign-in-result", handleResult, {
      once: true,
    });
    postNativeMessage({ type: "APPLE_SIGN_IN_REQUEST" });
  });
}

export interface PremiumPurchaseResult {
  ok: boolean;
  cancelled: boolean;
  message?: string;
}

interface PremiumPurchaseResultDetail {
  ok?: boolean;
  cancelled?: boolean;
  message?: string;
  nonce?: string;
}

// 결제/복원 시트 상호작용(카드 입력/인증) 여유를 위해 길게.
const PREMIUM_PURCHASE_TIMEOUT_MS = 180_000;

function makeNonce(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// 네이티브에 메시지를 보내고 지정한 결과 이벤트를 기다린다.
// 요청마다 nonce를 부여하고, 응답의 nonce가 일치할 때만 수락한다
// (타임아웃 후 재시도 등에서 이전 요청의 늦은 결과가 새 요청을 오배달하는 것 방지).
function awaitNativeResult(
  resultEvent: string,
  buildMessage: (nonce: string) => NativeMessage
): Promise<PremiumPurchaseResult> {
  return new Promise((resolve, reject) => {
    if (!isReactNativeWebView()) {
      reject(new Error("Not running inside React Native WebView"));
      return;
    }

    const nonce = makeNonce();

    const handleResult = (event: Event) => {
      const detail = (event as CustomEvent<PremiumPurchaseResultDetail>).detail;
      // 다른 요청의 늦은 결과는 무시(nonce가 있으면 일치할 때만 수락, 없으면 하위호환 수락).
      if (detail?.nonce != null && detail.nonce !== nonce) return;
      cleanup();
      resolve({
        ok: !!detail?.ok,
        cancelled: !!detail?.cancelled,
        message: detail?.message,
      });
    };

    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("결제 응답 시간이 초과되었습니다"));
    }, PREMIUM_PURCHASE_TIMEOUT_MS);

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener(resultEvent, handleResult);
    };

    window.addEventListener(resultEvent, handleResult);
    postNativeMessage(buildMessage(nonce));
  });
}

/**
 * 네이티브(RevenueCat)에 프리미엄 일회성 언락 구매를 요청한다.
 * userId(=Supabase uid)로 RevenueCat 식별 → 웹훅이 우리 유저에 매핑.
 * tier 갱신은 웹훅(서버 권위)이 담당. 여기서는 UX 신호만.
 */
export function requestPremiumPurchase(
  userId: string,
  productId?: string
): Promise<PremiumPurchaseResult> {
  return awaitNativeResult("premium-purchase-result", (nonce) => ({
    type: "PREMIUM_PURCHASE_REQUEST",
    userId,
    productId,
    nonce,
  }));
}

/** 구매 복원 (비소모성 필수 — 기기 변경/재설치 시 프리미엄 재동기화). */
export function restorePremiumPurchase(
  userId: string
): Promise<PremiumPurchaseResult> {
  return awaitNativeResult("premium-restore-result", (nonce) => ({
    type: "RESTORE_PURCHASES",
    userId,
    nonce,
  }));
}
