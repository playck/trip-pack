/**
 * 국가별 콘센트 플러그 모양 · 전압 정보
 * 출처: worldstandards.eu (IEC 기준)
 */

export interface PlugStandard {
  /** 전압 (예: "220V") */
  voltage: string;
  /** 플러그 모양 설명 (예: "둥근 2핀") */
  shape: string;
  /** 추가 팁 */
  tip?: string;
}

/** country code → 콘센트/전압 정보 */
export const PLUG_STANDARDS: Record<string, PlugStandard> = {
  // ── 동남아시아 ──
  TH: { voltage: "230V", shape: "납작 2핀 + 둥근 2핀 혼용" },
  SG: { voltage: "230V", shape: "영국식 네모 3핀", tip: "어댑터 필수" },
  MV: {
    voltage: "230V",
    shape: "영국식 네모 3핀 + 둥근 2핀 혼용",
    tip: "어댑터 필수",
  },
  PH: { voltage: "220V", shape: "납작 2핀 + 둥근 2핀 혼용" },
  VN: {
    voltage: "220V",
    shape: "납작 2핀 + 둥근 2핀 혼용",
    tip: "일부 지역 110V, 멀티 어댑터 권장",
  },
  KH: {
    voltage: "230V",
    shape: "납작·둥근·영국식 혼용",
    tip: "멀티 어댑터 권장",
  },
  MY: { voltage: "230V", shape: "영국식 네모 3핀", tip: "어댑터 필수" },
  ID: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  LA: { voltage: "230V", shape: "납작·둥근 혼용", tip: "멀티 어댑터 권장" },

  // ── 동아시아 ──
  JP: {
    voltage: "100V",
    shape: "납작 2핀",
    tip: "돼지코 어댑터 필요, 전압 낮아 드라이기 등 주의",
  },
  CN: { voltage: "220V", shape: "납작 2핀 + 팔자형 3핀 + 둥근 2핀 혼용" },
  TW: { voltage: "110V", shape: "납작 2핀", tip: "전압 낮아 고전력 기기 주의" },
  HK: { voltage: "230V", shape: "영국식 네모 3핀", tip: "어댑터 필수" },
  MO: { voltage: "230V", shape: "영국식 네모 3핀", tip: "어댑터 필수" },
  MN: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 남아시아 ──
  IN: {
    voltage: "230V",
    shape: "굵은 둥근 3핀",
    tip: "한국과 다른 규격, 멀티 어댑터 권장",
  },
  NP: {
    voltage: "230V",
    shape: "둥근 2핀 + 굵은 3핀 혼용",
    tip: "멀티 어댑터 권장",
  },
  LK: { voltage: "230V", shape: "영국식 네모 3핀", tip: "어댑터 필수" },

  // ── 서유럽 ──
  WEU: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 동유럽 ──
  EEU: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  HR: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  SI: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 남유럽 / 지중해 ──
  ES: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  PT: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  GR: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  ME: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  TR: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 북유럽 ──
  NEU: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 코카서스 / 중앙아시아 ──
  GE: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  AZ: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  AM: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  UZ: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  KZ: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  KG: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 아프리카 / 중동 ──
  MA: { voltage: "230V", shape: "둥근 2핀(유럽식)" },
  EG: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 아프가니스탄 ──
  AF: { voltage: "230V", shape: "둥근 2핀(유럽식)" },

  // ── 오세아니아 ──
  AU: {
    voltage: "230V",
    shape: "팔자(八)형 납작 2핀",
    tip: "호주식 어댑터 필수",
  },
  NZ: {
    voltage: "230V",
    shape: "팔자(八)형 납작 2핀",
    tip: "호주식 어댑터 필수",
  },

  // ── 북미 ──
  US: { voltage: "120V", shape: "납작 2핀", tip: "전압 낮아 고전력 기기 주의" },
  CA: { voltage: "120V", shape: "납작 2핀", tip: "전압 낮아 고전력 기기 주의" },
};

/** country code로 콘센트 정보 요약 문자열 반환 */
export function getPlugNote(countryCode: string): string | undefined {
  const info = PLUG_STANDARDS[countryCode];
  if (!info) return undefined;

  let note = `${info.voltage}, ${info.shape}`;
  if (info.tip) {
    note += ` — ${info.tip}`;
  }
  return note;
}
