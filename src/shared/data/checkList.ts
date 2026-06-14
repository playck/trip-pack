export type CabinPolicy = "allowed" | "restricted" | "prohibited";

export interface PackItem {
  name: string;
  required?: boolean;
  notes?: string;
  cabin?: CabinPolicy;
  cabinNotes?: string;
  checked?: boolean;
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
    cabin: "allowed",
    cabinNotes:
      "기내만 허용, 위탁 금지. ≤100Wh 자유, 100~160Wh 항공사 승인, 160Wh 초과 반입 금지",
  },
];

export const CLOTHING_ITEMS: PackItem[] = [
  { name: "슬리퍼", cabin: "allowed" },
  { name: "선글라스", cabin: "allowed" },
  { name: "신발", cabin: "allowed" },
  { name: "모자", cabin: "allowed" },
  { name: "양말", cabin: "allowed" },
  { name: "잠옷", cabin: "allowed" },
  { name: "수면안대", cabin: "allowed" },
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
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "면도기(일회용/카트리지)",
    cabin: "allowed",
    cabinNotes: "일회용/카트리지형 일반 허용",
  },
  {
    name: "스킨/토너",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "로션/크림",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  { name: "면봉/화장솜", cabin: "allowed" },
  { name: "손톱깎이", cabin: "allowed" },
  {
    name: "수건(여행용 속건타월)",
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
    cabin: "restricted",
    cabinNotes: "겔/크림류로 100ml 규정",
  },
  {
    name: "화장품",
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
    required: true,
    cabin: "allowed",
  },
  { name: "멀미약", cabin: "allowed" },
  {
    name: "감기약(콧물/기침/목)",
    cabin: "allowed",
  },
  { name: "밴드/패드", required: true, cabin: "allowed" },
  {
    name: "소독 티슈/연고",
    cabin: "restricted",
    cabinNotes: "액체/겔 100ml 규정(연고)",
  },
  {
    name: "모기퇴치제(스프레이/로션)",
    cabin: "restricted",
    cabinNotes: "스프레이/액체 100ml 규정",
  },
  {
    name: "자외선 화상용 진정젤(알로에 등)",
    cabin: "restricted",
    cabinNotes: "겔 100ml 규정",
  },
  { name: "마스크", cabin: "allowed" },
  {
    name: "개인 처방약",
    required: true,
    notes: "처방전 영문 사본 지참",
    cabin: "allowed",
  },
];

export const MISC_OPTIONAL_ITEMS: PackItem[] = [
  { name: "의류 압축팩", cabin: "allowed" },
  {
    name: "지퍼백(여러 사이즈)",
    cabin: "allowed",
  },
  { name: "목베개", cabin: "allowed" },
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
  {
    name: "미니 배낭/크로스백",
    notes: "소매치기 방지 지퍼형 권장",
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
    name: "눈가리개/귀마개",
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
    name: "여분 수건",
    notes: "속건 타월 권장",
    cabin: "allowed",
  },
];
