interface TripNotificationMessage {
  type: "TRIP_NOTIFICATION";
  action: "schedule" | "cancel";
  tripId: string;
  tripTitle?: string;
  startDate?: string;
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

type NativeMessage =
  | TripNotificationMessage
  | HapticMessage
  | OpenUrlMessage
  | AppleSignInRequestMessage;

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
