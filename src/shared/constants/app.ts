export const APP_VERSION = "1.0.2";

export const APP_NAME = "트립팩";

/**
 * 프리미엄 결제 오픈 여부.
 * - false(기본): 결제 UI 전부 "준비 중" 처리 + 마이페이지 진입점 숨김.
 * - true: RevenueCat + RN 결제(B1) 완성 후 결제 노출.
 * 무료 3개 제한(서버 게이트)은 이 플래그와 무관하게 항상 작동한다.
 */
export const PAYMENT_LIVE = import.meta.env.VITE_PAYMENT_LIVE === "true";

/**
 * 무료 플랜 여행 생성 한도. 서버 RPC(create_trip_with_checklist)의 카운트 기준과 일치해야 한다.
 * 클라이언트에서는 결제 유도(페이월) 판단용 힌트로만 쓴다(최종 강제는 서버 게이트).
 */
export const FREE_TRIP_LIMIT = 3;

export const LEGAL_URLS = {
  PRIVACY_POLICY:
    "https://foil-macaroon-8ff.notion.site/Trip-Pack-33979c3fa916809f9820facbc2510a4c",
  TERMS_OF_SERVICE:
    "https://foil-macaroon-8ff.notion.site/TRIP-PACK-fd0f13fdde0e4245a5e060f5eb968d5b",
  REFUND_POLICY:
    "https://foil-macaroon-8ff.notion.site/Trip-Pack-39079c3fa9168057a51dcc3ec72e33b2",
  SUPPORT:
    "https://foil-macaroon-8ff.notion.site/Trip-Pack-35479c3fa91680999911d436d298470c",
} as const;
