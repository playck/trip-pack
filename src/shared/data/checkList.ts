type CabinPolicy = "allowed" | "restricted" | "prohibited";

export interface PackItem {
  name: string;
  required?: boolean;
  notes?: string;
  cabin?: CabinPolicy;
  cabinNotes?: string;
}

export const ESSENTIAL_ITEMS: PackItem[] = [
  {
    name: "여권",
    required: true,
    notes: "만료일 6개월 이상 권장, 분실 대비 사본/사진 보관",
    cabin: "allowed",
  },
  {
    name: "전자항공권(e-ticket)",
    required: true,
    notes: "앱/이메일/오프라인 저장",
    cabin: "allowed",
  },
  {
    name: "결제카드 (해외 결제 가능)",
    required: true,
    notes: "국제결제 허용/해외 사용 알림·수수료 확인",
    cabin: "allowed",
  },
  {
    name: "현지 통화(환전)",
    required: true,
    notes: "소액권 위주·야간 도착/교통 대비 소액 준비",
    cabin: "allowed",
  },
  {
    name: "여행자보험 ",
    required: true,
    notes: "",
    cabin: "allowed",
  },
  {
    name: "비자(필요 국가)",
    required: true,
    notes: "전자비자/도착비자 규정 확인",
    cabin: "allowed",
  },

  {
    name: "eSIM/현지 유심 정보",
    required: true,
    notes: "개통 방법/QR 코드 사전 저장",
    cabin: "allowed",
  },
];

export const ELECTRONICS_ITEMS: PackItem[] = [
  {
    name: "이어폰/헤드폰",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "충전 케이블(USB-C/Lightning 등)",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "충전기(벽충전 어댑터)",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "멀티 플러그(국가별 어댑터)",
    notes: "콘센트 규격/전압 확인",
    cabin: "allowed",
  },
  {
    name: "보조배터리",
    notes: "외출 시 필수 전원 보강",
    cabin: "allowed",
    cabinNotes:
      "기내만 허용, 위탁 금지. 보통 ≤100Wh 자유, 100~160Wh 항공사 승인",
  },
];

export const CLOTHING_ITEMS: PackItem[] = [
  {
    name: "슬리퍼",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "선글라스",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "신발",
    notes: "",
    cabin: "allowed",
  },
  { name: "모자", notes: "", cabin: "allowed" },
  {
    name: "양말",
    notes: "",
    cabin: "allowed",
  },
  { name: "잠옷", notes: "", cabin: "allowed" },
  { name: "수면안대", notes: "", cabin: "allowed" },
  { name: "속옷", notes: "", cabin: "allowed" },
  {
    name: "상의",
    notes: "",
    cabin: "allowed",
  },
  { name: "하의", notes: "", cabin: "allowed" },
  {
    name: "겉옷",
    notes: "",
    cabin: "allowed",
  },
];

export const TOILETRIES_ITEMS: PackItem[] = [
  {
    name: "칫솔",
    notes: "휴대 케이스 있으면 위생적",
    cabin: "allowed",
  },
  {
    name: "치약",
    notes: "",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "샴푸",
    notes: "트래블 용기(소분) 권장",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "클렌징 폼",
    notes: "",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정, 1L 지퍼백",
  },
  {
    name: "바디워시",
    notes: "숙소 비치 미확실 시",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "린스/트리트먼트",
    notes: "",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "면도기(일회용/카트리지)",
    notes: "안전면도기 권장",
    cabin: "allowed",
    cabinNotes: "일회용/카트리지형 일반 허용",
  },
  {
    name: "스킨/토너",
    notes: "소분 공병 사용",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  {
    name: "로션/크림",
    notes: "",
    cabin: "restricted",
    cabinNotes: "액체/겔류 100ml 규정",
  },
  { name: "면봉/화장솜", notes: "지퍼백 포장", cabin: "allowed" },
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
    notes: "보습 필수, 색조/무색 선택",
    cabin: "restricted",
    cabinNotes: "겔/크림류로 100ml 규정",
  },
  {
    name: "화장품",
    notes: "개인 루틴 최소화(베이스/색조 등 소분 권장)",
    cabin: "restricted",
    cabinNotes: "액체/겔/크림·마스카라 등 100ml 규정",
  },
];

export const EMERGENCY_MED_ITEMS: PackItem[] = [
  {
    name: "진통제/해열제",
    required: true,
    notes: "평소 복용 제품 위주",
    cabin: "allowed",
  },
  {
    name: "소화제",
    required: true,
    notes: "식사 패턴 변화 대비",
    cabin: "allowed",
  },
  {
    name: "지사제",
    required: true,
    notes: "물갈이 설사 대비",
    cabin: "allowed",
  },
  { name: "멀미약", notes: "배/버스/산악 이동 대비", cabin: "allowed" },
  {
    name: "감기약(콧물/기침/목)",
    notes: "기온차/에어컨 대비",
    cabin: "allowed",
  },
  { name: "밴드/패드", required: true, notes: "여분 넉넉히", cabin: "allowed" },
  {
    name: "소독 티슈/연고",
    notes: "티슈형 권장, 연고는 소용량",
    cabin: "restricted",
    cabinNotes: "액체/겔 100ml 규정(연고)",
  },
  {
    name: "모기퇴치제(스프레이/로션)",
    notes: "자연/여름 권장",
    cabin: "restricted",
    cabinNotes: "스프레이/액체 100ml 규정",
  },
  {
    name: "자외선 화상용 진정젤(알로에 등)",
    notes: "휴양지/여름",
    cabin: "restricted",
    cabinNotes: "겔 100ml 규정",
  },
  { name: "마스크", notes: "혼잡 장소 대비", cabin: "allowed" },
];

export const MISC_OPTIONAL_ITEMS: PackItem[] = [
  { name: "의류 압축팩", notes: "부피 절감, 주름 주의", cabin: "allowed" },
  {
    name: "지퍼백(여러 사이즈)",
    notes: "액체 누수 방지/소분/서류 보호",
    cabin: "allowed",
  },
  { name: "세탁망", notes: "세탁소/코인런드리 이용 시", cabin: "allowed" },
  { name: "목베게", notes: "장거리 비행/버스", cabin: "allowed" },
  { name: "물티슈", notes: "만능 아이템", cabin: "allowed" },
  {
    name: "미니가위",
    notes: "포장/실 제거",
    cabin: "restricted",
    cabinNotes: "칼날 길이 규정 주의(6cm 이하 등)",
  },
  { name: "볼펜/메모지", notes: "입국 카드/메모", cabin: "allowed" },
];

export const BABY_ITEMS: PackItem[] = [
  {
    name: "기저귀(여분)",
    notes: "하루 사용량 + 여분",
    cabin: "allowed",
  },
  {
    name: "물티슈(아기용)",
    notes: "저자극, 리필 1~2팩",
    cabin: "allowed",
  },
  {
    name: "분유(분말)/수유 준비",
    notes: "1회분 소분 컨테이너",
    cabin: "allowed",
  },
  {
    name: "젖병 2~3개",
    notes: "교체·세척 여유분",
    cabin: "allowed",
  },
  { name: "보온/보냉 텀블러", notes: "분유 물 온도 유지", cabin: "allowed" },
  {
    name: "여벌 옷(상/하/속옷)",
    notes: "오염 대비 1~2세트",
    cabin: "allowed",
  },
  { name: "스와들/얇은 담요", notes: "기내·숙소 온도 대응", cabin: "allowed" },
  { name: "아기띠/슬링", notes: "혼잡 구간 이동 필수템", cabin: "allowed" },
  {
    name: "기저귀 크림/연고",
    notes: "발진 예방",
    cabin: "restricted",
    cabinNotes: "겔/크림 100ml 규정",
  },
  {
    name: "해열제",
    notes: "발열 대비 기본 상비 (시럽/패치 중 택1)",
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
    notes: "사전 예약/수수료 결제, 편수 제한 있음",
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
    notes: "장거리 이동 필수, 누수 방지",
    cabin: "allowed",
  },
  {
    name: "몸줄/목줄",
    notes: "공항 이동·보안검색 시 안전 확보",
    cabin: "allowed",
  },
  {
    name: "네임택/연락처 태그",
    notes: "분실 대비 연락처 기재",
    cabin: "allowed",
  },
  {
    name: "여행용 물그릇(접이식)",
    notes: "기내 보안 통과 후 급수",
    cabin: "allowed",
  },
  {
    name: "사료(소분)·간식",
    notes: "일정+여분, 국가 반입 규정 확인",
    cabin: "allowed",
  },
  {
    name: "배변 봉투·지퍼백",
    notes: "공항/기내·현지 이동 시 필수",
    cabin: "allowed",
  },
  { name: "소변 패드", notes: "대기·환승 장시간 대비", cabin: "allowed" },
  {
    name: "애착담요/작은 장난감",
    notes: "스트레스 완화, 소음 적은 제품",
    cabin: "allowed",
  },
];

export const FITNESS_GYM_ITEMS: PackItem[] = [
  {
    name: "운동복(상의/하의)",
    notes: "",
    cabin: "allowed",
  },
  { name: "운동화", notes: "워킹/러닝 겸용", cabin: "allowed" },
  { name: "양말(운동용)", notes: "여분 1~2켤레", cabin: "allowed" },
  { name: "스포츠 타월(소형)", notes: "빠른 건조", cabin: "allowed" },
  { name: "탄력 밴드(루프 밴드)", notes: "초경량 전신 루틴", cabin: "allowed" },
];

export const SWIM_WATER_ITEMS: PackItem[] = [
  { name: "수영복", notes: "몸에 맞는 핏", cabin: "allowed" },
  { name: "수영모자", notes: "풀장 필수인 곳 많음", cabin: "allowed" },
  { name: "물안경", notes: "김서림 방지 확인", cabin: "allowed" },
  {
    name: "비치타월/스포츠 타월",
    notes: "숙소 제공 여부 확인",
    cabin: "allowed",
  },
  { name: "아쿠아슈즈/샌들", notes: "해변/암반 보호", cabin: "allowed" },
  { name: "방수팩(폰/귀중품)", notes: "물놀이 필수템급", cabin: "allowed" },
  { name: "래쉬가드", notes: "자외선/마찰 보호", cabin: "allowed" },
  {
    name: "선크림(워터프루프)",
    notes: "리프-세이프 권장",
    cabin: "restricted",
    cabinNotes: "액체/겔 100ml 규정",
  },
];

export const KOREAN_FOOD_ITEMS: PackItem[] = [
  { name: "컵라면", notes: "뜨거운 물만 있으면 OK", cabin: "allowed" },
  { name: "즉석밥", notes: "전자레인지/숙소 조리 확인", cabin: "allowed" },
  {
    name: "통조림 캔",
    notes: "참치 등, 개봉 시 냄새 주의",
    cabin: "allowed",
  },
  {
    name: "김치(소포장)",
    notes: "누수·냄새 방지 이중 밀폐",
    cabin: "restricted",
    cabinNotes: "액체/반액체 취급 가능(기내 100ml 규정)",
  },
  { name: "스낵", notes: "", cabin: "allowed" },
  {
    name: "고추장류(소포장/튜브)",
    notes: "비빔/양념 보완",
    cabin: "restricted",
    cabinNotes: "겔/액체 100ml 규정",
  },
  { name: "커피 믹스류/티백", notes: "숙소 포트 활용", cabin: "allowed" },
  {
    name: "일회용 수저류",
    notes: "",
    cabin: "allowed",
  },
  {
    name: "지퍼백/밀폐용기",
    notes: "",
    cabin: "allowed",
  },
];
