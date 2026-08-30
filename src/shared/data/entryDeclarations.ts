// 국가별 전자 입국신고·입국카드 요건 (자체 작성 데이터, 2026-07-19 공식 소스 검증).
// - 무비자여도 사전 전자신고가 필수인 국가가 많아 여행 생성 시 필수 준비물 아이템으로 자동 삽입한다.
// - 시행 공항·기한이 수시로 바뀌는 분야라 분기 재검증 루틴 대상.

export interface EntryDeclaration {
  /** 신고서 이름 — 체크리스트 아이템명에 사용 */
  name: string;
  /** 배지·알림용 축약명 (예: "TDAC") */
  shortName: string;
  /** 필수 여부 (false = 선택·권장) */
  required: boolean;
  /** 작성 가능 시점·기한 요약 */
  deadline: string;
  /** 작성 창이 열리는 시점 — 출발 N일 전 (미정의면 배너·알림 미노출) */
  opensDaysBefore?: number;
  /** 공식 작성 사이트 (확실한 경우만 기재) */
  url?: string;
  /** 부가 설명 */
  note?: string;
}

export const ENTRY_DECLARATIONS: Record<string, EntryDeclaration> = {
  TH: {
    name: "디지털 입국카드(TDAC)",
    shortName: "TDAC",
    required: true,
    deadline: "도착 3일 전부터 온라인 작성",
    opensDaysBefore: 3,
    url: "https://tdac.immigration.go.th",
    note: "미작성 시 입국 불가, QR 캡처 저장",
  },
  SG: {
    name: "SG 입국카드(SGAC)",
    shortName: "SGAC",
    required: true,
    deadline: "도착일 포함 3일 이내 작성",
    opensDaysBefore: 2,
    url: "https://eservices.ica.gov.sg/sgarrivalcard",
    note: "무료·한국어 지원",
  },
  MY: {
    name: "디지털 입국카드(MDAC)",
    shortName: "MDAC",
    required: true,
    deadline: "도착 3일 전부터 작성",
    opensDaysBefore: 3,
    url: "https://imigresen-online.imi.gov.my/mdac/main",
  },
  PH: {
    name: "eTravel QR 등록",
    shortName: "eTravel",
    required: true,
    deadline: "도착 72시간 이내 작성",
    opensDaysBefore: 3,
    url: "https://etravel.gov.ph",
    note: "전 연령 필수, QR 캡처 저장",
  },
  TW: {
    name: "온라인 입국신고서(TWAC)",
    shortName: "TWAC",
    required: true,
    deadline: "입국 3일 전부터 등록",
    opensDaysBefore: 3,
    url: "https://twac.immigration.gov.tw",
    note: "등록 후 72시간 이내 입국 필요, 가족·단체는 1명이 최대 16명 대표 등록 가능",
  },
  VN: {
    name: "온라인 사전 입국신고",
    shortName: "사전 입국신고",
    required: true,
    deadline: "출발 72시간 전부터 작성",
    opensDaysBefore: 3,
    url: "https://prearrival.immigration.gov.vn",
    note: "호치민·하노이·다낭·푸꾸옥 등 주요 공항 입국 시 필수, QR 캡처 저장",
  },
  ID: {
    name: "통합 입국신고(All Indonesia)",
    shortName: "All Indonesia",
    required: true,
    deadline: "도착 72시간 전부터 작성",
    opensDaysBefore: 3,
    url: "https://allindonesia.imigrasi.go.id",
    note: "입국·세관·검역 통합 신고, QR 캡처 저장",
  },
  KH: {
    name: "전자 입국신고(e-Arrival)",
    shortName: "e-Arrival",
    required: true,
    deadline: "도착 7일 전부터 작성",
    opensDaysBefore: 7,
    url: "https://arrival.gov.kh",
    note: "웹 또는 전용 앱 작성, QR 캡처 저장",
  },
  MV: {
    name: "여행자 신고(IMUGA)",
    shortName: "IMUGA",
    required: true,
    deadline: "입국 96시간 이내 작성",
    opensDaysBefore: 4,
    url: "https://imuga.immigration.gov.mv",
  },
  NZ: {
    name: "여행자 신고(NZTD)",
    shortName: "NZTD",
    required: true,
    deadline: "도착 24시간 전부터 제출 가능",
    opensDaysBefore: 1,
    url: "https://www.travellerdeclaration.govt.nz",
    note: "앱·웹 작성(종이 신고서도 가능)",
  },
  JP: {
    name: "Visit Japan Web 등록",
    shortName: "VJW",
    required: false,
    deadline: "입국 전 작성 권장",
    url: "https://www.vjw.digital.go.jp",
    note: "선택이지만 작성 시 종이 신고서 없이 입국 절차 단축",
  },
  CN: {
    name: "온라인 입국카드",
    shortName: "입국카드",
    required: false,
    deadline: "입국 전 온라인 사전 작성 가능",
    url: "https://s.nia.gov.cn/ArrivalCardFillingPC/",
    note: "2025.11.20부터 시행, 미작성 시 현장 QR·종이 작성 가능",
  },
};

/** 국가 코드로 전자 입국신고 요건을 찾는다. 없으면 null. */
export function getEntryDeclaration(
  countryCode?: string | null,
): EntryDeclaration | null {
  if (!countryCode) return null;
  return ENTRY_DECLARATIONS[countryCode.toUpperCase()] ?? null;
}

/**
 * 작성 가능 창이 열려 있는지 판단한다. 필수 신고 + opensDaysBefore가 정의된 국가만 대상.
 *
 * 기한은 대부분 도착일 기준이지만 앱은 출발일만 알기 때문에 출발일을 프록시로 쓴다.
 * 당일 도착 노선은 정확하고, 야간 도착 노선은 하루 이르게 열린다(공식 접수는 거부될 수 있음).
 * 대신 여행이 끝나기 전까지는 창을 닫지 않는다 — 도착 당일·여행 중에 미작성 상태로
 * 남아 있는 경우가 정작 가장 위험하기 때문.
 */
export function isDeclarationWindowOpen(
  declaration: EntryDeclaration,
  daysUntilTripStart: number,
  daysUntilTripEnd: number,
): boolean {
  if (!declaration.required || declaration.opensDaysBefore == null) return false;
  return (
    daysUntilTripEnd >= 0 && daysUntilTripStart <= declaration.opensDaysBefore
  );
}
