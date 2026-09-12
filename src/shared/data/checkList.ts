export type CabinPolicy = "allowed" | "restricted" | "prohibited";

/**
 * 짐 스타일 등급.
 * - `core`(기본): 성향과 무관하게 항상 생성
 * - `optional`: `minimal` 성향이면 생성하지 않음
 *
 * 미지정은 `core` 로 취급한다(안전한 기본값). 고정 6개 카테고리에만 부여하며,
 * 사용자가 직접 고른 조건부 카테고리(여행유형·계절 등)에는 부여하지 않는다.
 *
 * `required` 와는 별개 축이다 — `required` 는 UI 의 (필수) 표시용이고,
 * 생성 여부는 `tier` 만으로 판정한다. 여권·항공권 등은 고정 블록이 아닌
 * 필수 준비물 카테고리에 있어 애초에 이 판정을 타지 않는다.
 */
export type PackTier = "core" | "optional";

/**
 * 사용자의 짐 스타일. `profiles.packing_style` 과 같은 값이다.
 * 마이그레이션 후에는 `Database["public"]["Enums"]` 에서 파생하도록 바꾼다.
 * - `full`: 현재 동작(전부 생성). 성향을 안 고른 사용자의 기본값
 * - `minimal`: 고정 카테고리의 `optional` 등급을 생성하지 않음
 */
export type PackingStyle = "minimal" | "full";

/**
 * 등급·성향의 포함 범위. 값이 클수록 더 많이 포함한다.
 * 3단계로 늘릴 때는 두 표에 값을 하나씩 추가하면 되고, 판정 로직은 그대로다.
 */
const TIER_RANK: Record<PackTier, number> = { core: 0, optional: 1 };
const STYLE_RANK: Record<PackingStyle, number> = { minimal: 0, full: 1 };

/** 이 성향의 체크리스트에 해당 등급의 항목이 포함되는가. `tier` 미지정은 `core`. */
export const isIncludedInStyle = (
  tier: PackTier | undefined,
  style: PackingStyle
): boolean => TIER_RANK[tier ?? "core"] <= STYLE_RANK[style];

export interface PackItem {
  name: string;
  required?: boolean;
  notes?: string;
  cabin?: CabinPolicy;
  cabinNotes?: string;
  checked?: boolean;
  tier?: PackTier;
}

export const ESSENTIAL_ITEMS: PackItem[] = [
  {
    name: "여권",
    required: true,
    notes: "만료일 6개월 이상 권장, 사본·여권사진 별도 보관",
    cabin: "allowed",
  },
  {
    name: "전자항공권(e-ticket)",
    required: true,
    notes: "앱·이메일·오프라인 저장",
    cabin: "allowed",
  },
  {
    name: "결제카드 (해외 결제 가능)",
    required: true,
    notes: "해외 결제 허용 여부·수수료 확인",
    cabin: "allowed",
  },
  {
    name: "현지 통화(환전)",
    required: true,
    notes: "소액권 위주로 준비",
    cabin: "allowed",
  },
  {
    name: "여행자보험",
    required: true,
    notes: "출국 전 가입, 보장 범위 확인",
    cabin: "allowed",
  },
  {
    name: "eSIM/현지 유심 정보",
    required: true,
    notes: "개통 방법·QR 코드 사전 저장",
    cabin: "allowed",
  },
  {
    name: "국제운전면허증",
    notes: "렌터카 이용 시 필수, 출국 전 발급",
    cabin: "allowed",
  },
];

export const DOMESTIC_ESSENTIAL_ITEMS: PackItem[] = [
  { name: "신분증", required: true },
  {
    name: "숙소 예약 확인서",
    required: true,
    notes: "앱·스크린샷 저장",
  },
  {
    name: "교통 예약(KTX/버스/항공)",
    notes: "QR·바코드 오프라인 저장",
  },
  { name: "현금" },
  { name: "렌터카 예약 확인서", notes: "면허증 필수 지참" },
  { name: "충전기/보조배터리" },
];

export const ELECTRONICS_ITEMS: PackItem[] = [
  {
    name: "이어폰/헤드폰",
    cabin: "allowed",
  },
  {
    name: "충전 케이블(USB-C/Lightning 등)",
    cabin: "allowed",
  },
  {
    name: "충전기(벽충전 어댑터)",
    cabin: "allowed",
  },
  {
    name: "멀티 플러그(국가별 어댑터)",
    notes: "국가별 콘센트 규격·전압 확인",
    cabin: "allowed",
  },
  {
    name: "보조배터리",
    tier: "optional",
    cabin: "allowed",
    cabinNotes:
      "기내만 허용, 위탁 금지. 160Wh 이하 1인당 최대 2개(초과 반입 금지), 좌석 선반 보관 금지 — 몸에 소지",
  },
];

export const CLOTHING_ITEMS: PackItem[] = [
  { name: "슬리퍼", tier: "optional", cabin: "allowed" },
  { name: "선글라스", tier: "optional", cabin: "allowed" },
  { name: "신발", cabin: "allowed" },
  { name: "모자", tier: "optional", cabin: "allowed" },
  { name: "양말", cabin: "allowed" },
  { name: "잠옷", tier: "optional", cabin: "allowed" },
  { name: "수면안대", tier: "optional", cabin: "allowed" },
  { name: "속옷", cabin: "allowed" },
  { name: "상의", cabin: "allowed" },
  { name: "하의", cabin: "allowed" },
  { name: "겉옷", cabin: "allowed" },
];

export const TOILETRIES_ITEMS: PackItem[] = [
  {
    name: "칫솔",
    cabin: "allowed",
  },
  {
    name: "치약",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "샴푸",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "클렌징 폼",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "바디워시",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "면도기(일회용/카트리지)",
    tier: "optional",
    cabin: "allowed",
    cabinNotes: "일회용/카트리지형 일반 허용",
  },
  {
    name: "스킨/토너",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "로션/크림",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  { name: "면봉/화장솜", tier: "optional", cabin: "allowed" },
  { name: "손톱깎이", tier: "optional", cabin: "allowed" },
  {
    name: "수건(여행용 속건타월)",
    tier: "optional",
    cabin: "allowed",
  },
];

export const COSMETICS_ITEMS: PackItem[] = [
  {
    name: "선크림",
    required: true,
    notes: "워터프루프/PA 지수 확인",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 이하, 1L 투명 지퍼백",
  },
  {
    name: "립밤",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "겔/크림류로 100ml 규정",
  },
  {
    name: "화장품",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔/크림·마스카라 등 100ml 규정",
  },
];

export const EMERGENCY_MED_ITEMS: PackItem[] = [
  {
    name: "진통제/해열제",
    required: true,
    cabin: "allowed",
  },
  {
    name: "소화제",
    required: true,
    cabin: "allowed",
  },
  {
    name: "지사제",
    tier: "optional",
    required: true,
    cabin: "allowed",
  },
  { name: "멀미약", tier: "optional", cabin: "allowed" },
  {
    name: "감기약(콧물/기침/목)",
    tier: "optional",
    cabin: "allowed",
  },
  { name: "밴드/패드", tier: "optional", required: true, cabin: "allowed" },
  {
    name: "소독 티슈/연고",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "액체/겔 100ml 규정(연고)",
  },
  {
    name: "모기퇴치제(스프레이/로션)",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "스프레이/액체 100ml 규정",
  },
  {
    name: "자외선 화상용 진정젤(알로에 등)",
    tier: "optional",
    cabin: "restricted",
    cabinNotes: "겔 100ml 규정",
  },
  { name: "마스크", tier: "optional", cabin: "allowed" },
  {
    name: "개인 처방약",
    required: true,
    notes: "처방전 영문 사본 지참",
    cabin: "allowed",
  },
];

export const MISC_OPTIONAL_ITEMS: PackItem[] = [
  { name: "의류 압축팩", tier: "optional", cabin: "allowed" },
  {
    name: "지퍼백(여러 사이즈)",
    cabin: "allowed",
  },
  { name: "목베개", tier: "optional", cabin: "allowed" },
  {
    name: "미니 배낭/크로스백",
    tier: "optional",
    notes: "여권·현금 등 귀중품 휴대, 소매치기 방지 지퍼형 권장",
    cabin: "allowed",
  },
  { name: "물티슈", cabin: "allowed" },
];

export const BABY_ITEMS: PackItem[] = [
  {
    name: "기저귀(여분)",
    notes: "하루 사용량 + 여분",
    cabin: "allowed",
  },
  {
    name: "물티슈(아기용)",
    notes: "여분 1~2팩",
    cabin: "allowed",
  },
  {
    name: "분유(분말)/수유 준비",
    notes: "1회분 소분 컨테이너",
    cabin: "allowed",
  },
  {
    name: "젖병 2~3개",
    cabin: "allowed",
  },
  { name: "보온/보냉 텀블러", cabin: "allowed" },
  {
    name: "여벌 옷(상/하/속옷)",
    notes: "1~2세트",
    cabin: "allowed",
  },
  { name: "스와들/얇은 담요", cabin: "allowed" },
  { name: "아기띠/슬링", cabin: "allowed" },
  {
    name: "기저귀 크림/연고",
    cabin: "restricted",
    cabinNotes: "겔/크림 100ml 규정",
  },
  {
    name: "해열제",
    notes: "시럽·패치 중 택1",
    cabin: "restricted",
    cabinNotes: "액체 100ml 규정(시럽)",
  },
];

export const PET_TRAVEL_ITEMS: PackItem[] = [
  {
    name: "검역 증명서(공식 문서)",
    notes: "출·입국 국가 검역소 발급/인증",
    cabin: "allowed",
  },
  {
    name: "항공사 반려동물 사전 승인서",
    notes: "사전 예약·수수료 결제, 편수 제한 있음",
    cabin: "allowed",
  },
  {
    name: "마이크로칩 정보",
    notes: "ISO 규격 확인, 번호가 서류와 일치해야 함",
    cabin: "allowed",
  },
  {
    name: "항공 승인 케이지(소프트/하드)",
    notes: "기내 규격: 좌석 하부 수납 가능 크기, 위탁은 IATA 기준",
    cabin: "allowed",
  },
  {
    name: "흡수패드/바닥 라이너",
    cabin: "allowed",
  },
  {
    name: "몸줄/목줄",
    cabin: "allowed",
  },
  {
    name: "네임택/연락처 태그",
    cabin: "allowed",
  },
  {
    name: "여행용 물그릇(접이식)",
    cabin: "allowed",
  },
  {
    name: "사료(소분)·간식",
    notes: "국가별 반입 규정 확인",
    cabin: "allowed",
  },
  {
    name: "배변 봉투·지퍼백",
    cabin: "allowed",
  },
  { name: "소변 패드", cabin: "allowed" },
  {
    name: "애착담요/작은 장난감",
    cabin: "allowed",
  },
];

export const FITNESS_GYM_ITEMS: PackItem[] = [
  {
    name: "운동복(상의/하의)",
    cabin: "allowed",
  },
  { name: "운동화", cabin: "allowed" },
  { name: "양말(운동용)", cabin: "allowed" },
  { name: "스포츠 타월(소형)", cabin: "allowed" },
];

export const SWIM_WATER_ITEMS: PackItem[] = [
  { name: "수영복", cabin: "allowed" },
  { name: "수영모자", notes: "착용 의무 풀장 많음", cabin: "allowed" },
  { name: "물안경", cabin: "allowed" },
  {
    name: "비치타월/스포츠 타월",
    notes: "숙소 제공 여부 확인",
    cabin: "allowed",
  },
  { name: "아쿠아슈즈/샌들", cabin: "allowed" },
  { name: "방수팩(폰/귀중품)", cabin: "allowed" },
  { name: "래쉬가드", cabin: "allowed" },
  {
    name: "선크림(워터프루프)",
    notes: "리프-세이프(산호 보호) 권장",
    cabin: "restricted",
    cabinNotes: "액체/겔 100ml 규정",
  },
];

export const KOREAN_FOOD_ITEMS: PackItem[] = [
  { name: "컵라면", cabin: "allowed" },
  { name: "즉석밥", notes: "숙소 조리수단 확인", cabin: "allowed" },
  {
    name: "김치(소포장)",
    notes: "누수·냄새 방지 이중 밀폐",
    cabin: "restricted",
    cabinNotes: "액체/반액체 취급 가능(기내 100ml 규정)",
  },
  { name: "스낵", cabin: "allowed" },
  {
    name: "고추장류(소포장/튜브)",
    cabin: "restricted",
    cabinNotes: "겔/액체 100ml 규정",
  },
  { name: "커피 믹스류/티백", cabin: "allowed" },
  { name: "일회용 수저류", cabin: "allowed" },
  { name: "지퍼백/밀폐용기", cabin: "allowed" },
];

// ── 여행 유형별 아이템 ──

export const BUSINESS_ITEMS: PackItem[] = [
  {
    name: "노트북/태블릿",
    cabin: "allowed",
  },
  {
    name: "노트북 충전기",
    cabin: "allowed",
  },
  {
    name: "정장/비즈니스 캐주얼",
    cabin: "allowed",
  },
  { name: "명함", cabin: "allowed" },
  { name: "서류/문서", notes: "오프라인 백업", cabin: "allowed" },
];

export const SIGHTSEEING_ITEMS: PackItem[] = [
  { name: "카메라", notes: "메모리카드·배터리 여분", cabin: "allowed" },
  {
    name: "셀카봉/삼각대",
    cabin: "allowed",
  },
  { name: "편한 워킹화", cabin: "allowed" },
];

export const NATURE_ITEMS: PackItem[] = [
  {
    name: "등산화/트레킹화",
    cabin: "allowed",
  },
  { name: "경량 배낭", notes: "20~30L 권장", cabin: "allowed" },
  {
    name: "우비/방수 재킷",
    cabin: "allowed",
  },
  { name: "물병(텀블러)", notes: "1인 500ml 이상", cabin: "allowed" },
  {
    name: "등산 스틱(접이식)",
    cabin: "prohibited",
    cabinNotes: "기내 반입 금지, 위탁 수하물로",
  },
  {
    name: "헤드랜턴/손전등",
    cabin: "allowed",
  },
];

export const ACTIVITY_ITEMS: PackItem[] = [
  {
    name: "액션캠/방수 카메라",
    notes: "마운트·방수 케이스 확인",
    cabin: "allowed",
  },
  { name: "스포츠 선글라스", cabin: "allowed" },
  { name: "스포츠 의류", cabin: "allowed" },
  {
    name: "보호대(무릎/팔꿈치)",
    cabin: "allowed",
  },
  {
    name: "방수 스마트폰 케이스",
    cabin: "allowed",
  },
];

export const RESORT_ITEMS: PackItem[] = [
  {
    name: "리조트웨어/비치원피스",
    cabin: "allowed",
  },
  {
    // 눈가리개는 의류의 `수면안대` 와 같은 물건이라 제외하고 귀마개만 둔다.
    name: "귀마개",
    cabin: "allowed",
  },
  { name: "양산", cabin: "allowed" },
];

export const SHOPPING_ITEMS: PackItem[] = [
  {
    name: "여분 접이식 가방",
    cabin: "allowed",
  },
  { name: "에코백", notes: "비닐봉투 유료 국가 대비", cabin: "allowed" },
  {
    name: "면세 쇼핑 리스트",
    notes: "사전 가격 비교·면세점 예약",
    cabin: "allowed",
  },
  {
    name: "여권 사본(면세 구매용)",
    notes: "시내 면세 구매 시 필요",
    cabin: "allowed",
  },
];

// ── 계절별 추가 아이템 ──

export const SUMMER_ITEMS: PackItem[] = [
  // 아래 셋은 고정 카테고리에도 있지만 거기선 `optional` 이다.
  // 이름을 맞춰 두면 full 에서는 중복 제거가 잡고, minimal 에서는
  // "여름·열대 목적지" 라는 조건이 되살린다.
  { name: "모자", cabin: "allowed" },
  { name: "선글라스", cabin: "allowed" },
  {
    name: "모기퇴치제(스프레이/로션)",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 이하, 1L 투명 지퍼백",
  },
  {
    name: "양산/UV 우산",
    cabin: "allowed",
  },
  {
    name: "쿨링 스프레이/쿨타월",
    cabin: "restricted",
    cabinNotes: "스프레이 100ml 규정",
  },
  { name: "휴대용 선풍기", cabin: "allowed" },
  {
    name: "반팔/반바지 여벌",
    cabin: "allowed",
  },
  {
    name: "벌레 퇴치 팔찌/패치",
    cabin: "allowed",
  },
];

export const WINTER_ITEMS: PackItem[] = [
  // 화장품에도 있으나 거기선 `optional`. 겨울엔 선크림보다 더 필요하다.
  {
    name: "립밤",
    cabin: "restricted",
    cabinNotes: "겔/크림류로 100ml 규정",
  },
  { name: "핫팩", cabin: "allowed" },
  { name: "내복/히트텍", cabin: "allowed" },
  { name: "장갑", notes: "터치스크린 호환 권장", cabin: "allowed" },
  { name: "목도리", cabin: "allowed" },
  {
    name: "보습 핸드크림",
    cabin: "restricted",
    cabinNotes: "크림류 100ml 규정",
  },
  { name: "방한 패딩/코트", cabin: "allowed" },
];

export const RAINY_ITEMS: PackItem[] = [
  { name: "우산(접이식)", cabin: "allowed" },
  { name: "우비/방수 재킷", cabin: "allowed" },
  {
    name: "방수 파우치",
    cabin: "allowed",
  },
  {
    // 세면용품의 같은 항목과 이름을 맞춰 둔다. 이름이 같아야
    // full 에서는 중복 제거가 잡아내고, minimal 에서는 우기 조건이 되살린다.
    name: "수건(여행용 속건타월)",
    notes: "우기엔 여벌로, 속건 타월 권장",
    cabin: "allowed",
  },
];
