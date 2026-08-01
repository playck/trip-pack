/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 프리미엄 결제 오픈 여부. "true" 일 때만 결제 UI 노출. */
  readonly VITE_PAYMENT_LIVE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
