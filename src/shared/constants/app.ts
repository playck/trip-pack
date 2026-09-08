export const APP_VERSION = "1.0.2";

export const APP_NAME = "트립팩";

/**
 * 프리미엄 결제 오픈 여부.
 * 무료 3개 제한(서버 게이트)은 이 플래그와 무관하게 항상 작동.
 */
export const PAYMENT_LIVE = import.meta.env.VITE_PAYMENT_LIVE === "true";

/**
 * 무료 플랜 여행 생성 한도. 서버 RPC(create_trip_with_checklist)의 카운트 기준과 일치해야 한다.
 */
export const FREE_TRIP_LIMIT = 3;

/** App Store Connect 비소모성 상품 ID. RN 앱 services/purchases.ts와 같은 값. */
export const PREMIUM_PRODUCT_ID = "com.trippack.app.premium";

/**
 * 프리미엄 표시용 가격(폴백). App Store Connect의 상품 가격과 수동으로 맞춘다.
 * - 앱이 스토어 현지화 가격을 회신하면(1.0.3+) 그 값을 우선 쓰고, 웹·구버전 앱에서만 이 값을 보여 준다.
 */
export const PREMIUM_PRICE_FALLBACK: {
  priceString: string;
  price: number;
  currencyCode: string;
} | null = { priceString: "₩3,300", price: 3300, currencyCode: "KRW" };

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
