// 규정 검증 기준일: 2026-07-18
// 주요 출처: 국토교통부 정책브리핑(보조배터리 2026.4.20 개정), 인천국제공항 제한물품 안내,
// 항공보안365, 일본 동물검역소·세관, 대만 관세청, 미국 CBP, 호주 DAFF, EU Commission
export const BAGGAGE_POLICY_VERIFIED_AT = "2026-07-18";

export type TransportStatus = "allowed" | "prohibited" | "restricted";

export interface CountryRestriction {
  countryCode: string; // ISO 2자리 코드
  countryName: string; // 국가명
  status: TransportStatus; // 해당 국가에서의 반입 상태
  message: string; // 안내 메시지
}

export interface CabinCheckItem {
  name: string; // 대표 명칭
  description: string; // 상세 설명 및 예시
  category: string; // 카테고리 분류

  // 기내 수하물 (Cabin) 관련
  cabin: {
    status: TransportStatus;
    reason: string;
  };

  // 위탁 수하물 (Checked) 관련
  checked: {
    status: TransportStatus;
    reason: string;
  };

  keywords: string[]; // 검색 매칭을 위한 키워드 모음 (검색용)
  countryRestrictions?: CountryRestriction[]; // 국가별 특수 규정
}

export const BAGGAGE_POLICY_DATA: CabinCheckItem[] = [
  // --- 0. 음식물/식품 ---
  {
    name: "고형 식품",
    description: "김밥, 샌드위치, 빵, 과자 등 국물이 없는 음식",
    category: "food",
    cabin: {
      status: "allowed",
      reason: "액체가 없는 고형 음식은 반입 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: [
      "음식",
      "간식",
      "도시락",
      "초콜릿",
      "스낵",
      "빵",
      "김밥",
      "샌드위치",
      "과자",
      "쿠키",
      "떡",
      "커피믹스",
      "김",
      "견과류",
      "땅콩",
      "아몬드",
      "호두",
      "사탕",
      "젤리",
      "캔디",
      "원두",
      "커피원두",
      "녹차",
      "홍차",
      "티백",
      "찻잎",
      "향신료",
      "후추",
      "고춧가루",
    ],
  },
  {
    name: "가공육 및 육류",
    description: "육포, 소시지, 햄, 장조림, 순대, 생고기",
    category: "food",
    cabin: {
      status: "allowed",
      reason:
        "보안 검색은 통과 가능하나 도착국 검역에서 문제가 될 수 있습니다.",
    },
    checked: {
      status: "allowed",
      reason: "위탁은 가능하나 도착국 검역 시 압수 대상이 될 수 있습니다.",
    },
    keywords: [
      "고기",
      "가공육",
      "반찬",
      "비첸향",
      "천하장사",
      "스팸",
      "육포",
      "소시지",
      "햄",
      "순대",
      "생고기",
      "삼겹살",
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "일본은 가공육 반입을 엄격히 금지하며, 적발 시 압수 및 처벌 대상이 됩니다.",
      },
      {
        countryCode: "US",
        countryName: "미국",
        status: "prohibited",
        message:
          "대부분의 육류(소, 돼지, 닭 등) 성분이 든 식품은 반입이 금지됩니다. 밀봉된 상온보관 조리 제품 등 일부만 예외입니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message:
          "호주는 모든 육류 제품의 반입이 엄격히 금지됩니다. 반드시 신고해야 하며 미신고 적발 시 고액 벌금·비자 취소까지 가능합니다.",
      },
      {
        countryCode: "TW",
        countryName: "대만",
        status: "prohibited",
        message:
          "육가공품(소시지, 햄 등) 반입 적발 시 1차 NT$20만, 재범 NT$100만의 벌금이 부과됩니다.",
      },
      {
        countryCode: "CN",
        countryName: "중국",
        status: "prohibited",
        message:
          "생고기·가열조리 육류·내장을 포함한 모든 육류 제품의 휴대 반입이 금지됩니다.",
      },
      {
        countryCode: "FR",
        countryName: "프랑스",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 육류·육가공품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "IT",
        countryName: "이탈리아",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 육류·육가공품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "ES",
        countryName: "스페인",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 육류·육가공품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "DE",
        countryName: "독일",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 육류·육가공품 반입을 원칙적으로 금지합니다.",
      },
    ],
  },
  {
    name: "생과일, 야채, 씨앗",
    description: "사과, 망고, 생채소, 식물 씨앗",
    category: "food",
    cabin: {
      status: "restricted",
      reason: "보안검색은 통과 가능하나 도착국 검역 시 압수될 수 있습니다.",
    },
    checked: {
      status: "restricted",
      reason: "도착국 농수산물 검역 규정에 따라 반입이 금지될 수 있습니다.",
    },
    keywords: [
      "과일",
      "야채",
      "채소",
      "농산물",
      "식물",
      "씨앗",
      "망고",
      "사과",
      "귤",
      "오렌지",
      "바나나",
      "포도",
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "대부분의 생과일과 야채는 병해충 전염 우려로 반입이 금지됩니다.",
      },
      {
        countryCode: "US",
        countryName: "미국",
        status: "prohibited",
        message: "모든 생과일, 채소, 씨앗은 반입 금지 품목입니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message:
          "세계에서 가장 엄격한 검역을 시행합니다. 생과일은 절대 불가하며 적발 시 고액의 벌금이 부과됩니다.",
      },
    ],
  },
  {
    name: "즉석밥",
    description: "햇반, 오뚜기밥 등 포장 즉석밥",
    category: "food",
    cabin: {
      status: "allowed",
      reason: "고형 식품으로 분류되어 기내 반입 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: ["햇반", "즉석밥", "오뚜기밥"],
  },
  {
    name: "죽·푸딩 등 액상 식품",
    description: "죽, 푸딩, 국물이 있는 즉석식품(컵반 국밥류 등)",
    category: "food",
    cabin: {
      status: "restricted",
      reason: "액체/젤류로 분류되어 100ml 초과 시 기내 반입이 불가합니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 반입 가능합니다." },
    keywords: ["죽", "푸딩", "컵반", "스프"],
  },
  {
    name: "음료 (물·주스·탄산)",
    description: "생수, 주스, 탄산음료, 커피 등 마실 것",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "액체류 규정이 적용되어 100ml 초과 음료는 기내 반입이 불가합니다. 보안검색 통과 후 면세구역에서 구매한 음료는 반입 가능합니다.",
    },
    checked: {
      status: "allowed",
      reason: "위탁 수하물로는 용량 제한 없이 가능합니다.",
    },

    keywords: [
      "생수",
      "음료",
      "음료수",
      "주스",
      "탄산음료",
      "콜라",
      "사이다",
      "커피",
    ],
  },
  {
    name: "유아식 (분유·이유식)",
    description: "분유, 이유식, 유아용 음료",
    category: "food",
    cabin: {
      status: "allowed",
      reason:
        "유아 동반 시 비행 중 필요한 양만큼 액체류 규정과 무관하게 기내 반입 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: ["이유식", "분유", "유아식", "젖병"],
  },
  {
    name: "라면/컵라면",
    description: "봉지라면, 컵라면 등 즉석 면류",
    category: "food",
    cabin: {
      status: "allowed",
      reason: "고형 식품으로 기내 반입 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: ["라면", "컵라면", "신라면", "불닭볶음면", "짜파게티"],
    countryRestrictions: [
      {
        countryCode: "TW",
        countryName: "대만",
        status: "restricted",
        message:
          "건더기 고기가 든 라면은 반입 금지이며 적발 시 고액 벌금(최대 NT$100만)이 부과될 수 있습니다. 분말스프 제품도 성분 확인이 필요합니다.",
      },
    ],
  },
  {
    name: "통조림",
    description: "참치캔, 햄 통조림 등 캔 포장 식품",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "국물·기름 등 액체가 포함된 통조림은 100ml 초과 시 기내 반입이 제한될 수 있습니다.",
    },
    checked: {
      status: "allowed",
      reason: "위탁 수하물로 반입 가능합니다. (도착국 검역 규정은 별도 확인)",
    },
    keywords: ["통조림", "참치캔", "꽁치캔", "골뱅이"],
  },
  {
    name: "김치 및 액체류 반찬",
    description: "김치, 깍두기, 장아찌, 젓갈류",
    category: "food",
    cabin: {
      status: "restricted",
      reason: "액체/젤류로 분류되어 100ml 이하 용기만 가능합니다.",
    },
    checked: {
      status: "allowed",
      reason: "밀폐 포장 시 용량 제한 없이 가능합니다.",
    },
    keywords: [
      "김치",
      "깍두기",
      "장아찌",
      "반찬",
      "액체류",
      "장류",
      "젓갈",
      "오징어젓갈",
    ],
    countryRestrictions: [
      {
        countryCode: "AU",
        countryName: "호주",
        status: "restricted",
        message:
          "상업적으로 제조되어 포장된 제품은 가능하나, 집에서 담근 김치는 검역관의 판단에 따라 파기될 수 있습니다.",
      },
    ],
  },
  {
    name: "장류 및 꿀",
    description: "고추장, 된장, 쌈장, 꿀, 잼",
    category: "food",
    cabin: {
      status: "restricted",
      reason: "젤류로 분류되어 100ml 이하 용기만 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: [
      "고추장",
      "된장",
      "쌈장",
      "꿀",
      "잼",
      "양념",
      "소스",
      "스프레드",
      "누텔라",
      "피넛버터",
      "벌꿀",
      "간장",
    ],
    countryRestrictions: [
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message:
          "호주 서부 등 일부 지역은 꿀의 반입을 완전히 금지하거나 엄격히 제한합니다.",
      },
    ],
  },
  {
    name: "식용 기름",
    description: "참기름, 들기름, 올리브유, 식용유",
    category: "food",
    cabin: {
      status: "restricted",
      reason: "액체류로 분류되어 100ml 이하 용기만 기내 반입 가능합니다.",
    },
    checked: {
      status: "allowed",
      reason: "누수되지 않게 밀폐 포장하면 위탁 반입 가능합니다.",
    },
    keywords: ["참기름", "들기름", "식용유", "올리브유", "기름"],
  },
  {
    name: "유제품",
    description: "치즈, 버터, 우유, 요거트",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "우유·요거트 등 액체성 유제품은 100ml 규정이 적용됩니다. 고형 치즈는 반입 가능합니다.",
    },
    checked: {
      status: "allowed",
      reason: "위탁 가능하나 도착국 검역 규정 확인이 필요합니다.",
    },
    keywords: ["치즈", "버터", "우유", "요거트", "유제품", "요구르트"],
    countryRestrictions: [
      {
        countryCode: "CN",
        countryName: "중국",
        status: "prohibited",
        message:
          "생우유·요거트·치즈·버터 등 비열처리 유제품의 반입이 금지됩니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "restricted",
        message:
          "모든 유제품은 신고 대상이며 검역 조건에 따라 압수될 수 있습니다.",
      },
      {
        countryCode: "FR",
        countryName: "프랑스",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 유제품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "IT",
        countryName: "이탈리아",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 유제품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "ES",
        countryName: "스페인",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 유제품 반입을 원칙적으로 금지합니다.",
      },
      {
        countryCode: "DE",
        countryName: "독일",
        status: "prohibited",
        message:
          "EU는 비EU 국가에서 오는 여행자의 유제품 반입을 원칙적으로 금지합니다.",
      },
    ],
  },
  {
    name: "주류 (술)",
    description: "소주, 와인, 위스키, 맥주 등",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "액체류 100ml 규정이 적용됩니다. 면세점 구매 주류는 봉인백(STEB) 미개봉 상태에 한해 기내 반입 가능합니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "도수 24% 이하는 용량 제한 없음, 24~70%는 1인당 5L까지 가능, 70% 초과는 운송 자체가 금지됩니다.",
    },
    keywords: [
      "술",
      "주류",
      "소주",
      "와인",
      "위스키",
      "맥주",
      "양주",
      "사케",
      "샴페인",
      "알코올",
      "막걸리",
      "알콜음료",
      "알콜",
      "하이볼",
    ],
  },

  // --- 1. 기내 금지 물품 (위탁 가능) ---
  {
    name: "칼류",
    description: "부엌칼, 커터칼, 맥가이버칼, 면도칼",
    category: "tools",
    cabin: {
      status: "prohibited",
      reason: "날카로운 물건은 기내 반입이 금지됩니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 보내셔야 합니다." },
    keywords: [
      "칼",
      "부엌칼",
      "커터칼",
      "맥가이버칼",
      "나이프",
      "도구",
      "흉기",
      "과도",
      "식칼",
      "회칼",
      "면도날",
      "면도기날",
    ],
  },
  {
    name: "가위",
    description: "문구용·주방용 가위 (날 길이 6cm 기준)",
    category: "tools",
    cabin: {
      status: "restricted",
      reason:
        "날 길이 6cm 이하 소형 가위(눈썹가위 등)만 기내 반입 가능하며, 초과 시 위탁해야 합니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 가능합니다." },
    keywords: ["가위", "주방가위", "학용품", "눈썹가위", "손톱가위"],
  },
  {
    name: "공구류",
    description: "망치, 드릴, 스패너, 렌치",
    category: "tools",
    cabin: {
      status: "prohibited",
      reason:
        "망치·드릴 등은 크기와 무관하게, 스패너·렌치 등 수공구는 길이 10cm 초과 시 기내 반입이 금지됩니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 가능합니다." },
    keywords: [
      "망치",
      "드릴",
      "스패너",
      "렌치",
      "드라이버",
      "공구",
      "작업도구",
      "송곳",
    ],
  },
  {
    name: "스포츠 장비",
    description: "골프채, 야구배트, 하키스틱, 당구큐대",
    category: "sports",
    cabin: {
      status: "prohibited",
      reason: "무기로 사용될 수 있어 기내 반입이 불가합니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 보내야 합니다." },
    keywords: [
      "골프채",
      "야구배트",
      "하키스틱",
      "스키폴",
      "낚싯대",
      "운동기구",
      "등산스틱",
      "아이젠",
      "스케이트보드",
      "스노보드",
      "스키플레이트",
      "스키장비",
      "서핑보드",
      "테니스라켓",
      "배드민턴라켓",
      "라켓",
      "볼링공",
      "아령",
      "덤벨",
      "케틀벨",
    ],
  },
  {
    name: "무기류·호신용품",
    description: "전자충격기, 총기, 모형·장난감총, 삼단봉, 수갑",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "무기류 및 호신용품은 기내 반입이 금지됩니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "전자충격기·모형총·장난감총 등은 위탁 가능합니다. 실제 총기는 허가서 지참·총알 분리 등 절차와 항공사 사전 승인이 필요합니다.",
    },
    keywords: [
      "총",
      "권총",
      "총기",
      "모형총",
      "장난감총",
      "물총",
      "비비탄",
      "전자충격기",
      "테이저",
      "삼단봉",
      "너클",
      "쌍절곤",
      "수갑",
      "작살",
      "작살총",
      "석궁",
      "조준경",
      "무기",
      "활",
      "쿠보탄",
    ],
  },
  {
    name: "호신용 스프레이",
    description: "페퍼 스프레이 등 호신용 분사기",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "호신용 분사기는 기내 반입이 금지됩니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "1인당 용기 용량 100ml 이하 1개만 위탁 가능합니다. 일부 항공사는 운송 자체를 금지하므로 사전 확인이 필요합니다.",
    },
    keywords: [
      "호신용스프레이",
      "페퍼스프레이",
      "호신스프레이",
      "최루스프레이",
    ],
  },

  // --- 2. 위탁 금지 물품 (기내 휴대 필수) ---
  {
    name: "보조배터리",
    description: "보조배터리, 여분 리튬이온 배터리 (160Wh 이하)",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason:
        "160Wh 이하만 기내 휴대 가능하며 1인당 최대 2개입니다. 좌석 선반 보관은 금지 — 몸에 소지하거나 앞주머니에 두고, 단자를 절연하거나 지퍼백에 개별 포장해야 합니다. 기내 충전·사용은 금지됩니다.",
    },
    checked: {
      status: "prohibited",
      reason: "화재 위험으로 위탁 수하물 반입이 절대 금지됩니다.",
    },
    keywords: [
      "보조배터리",
      "배터리",
      "리튬배터리",
      "파워뱅크",
      "휴대폰배터리",
    ],
    countryRestrictions: [
      {
        countryCode: "CN",
        countryName: "중국",
        status: "restricted",
        message:
          "중국 국내선(환승 포함) 탑승 시 CCC(3C) 인증 표시가 없는 보조배터리는 반입이 금지되어 압수될 수 있습니다. 용량 표기가 훼손된 배터리도 반입이 거부될 수 있습니다.",
      },
    ],
  },
  {
    name: "전자담배",
    description: "궐련형, 액상형 전자담배 기기",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason:
        "기내 휴대만 가능하며, 좌석 선반 보관 금지 — 몸에 소지해야 합니다. 기내 사용/충전은 금지됩니다.",
    },
    checked: {
      status: "prohibited",
      reason: "화재 위험으로 위탁 수하물 반입이 금지됩니다.",
    },
    keywords: ["전자담배", "전담", "아이코스", "릴", "글로", "베이핑"],
    countryRestrictions: [
      {
        countryCode: "TH",
        countryName: "태국",
        status: "prohibited",
        message:
          "태국은 전자담배 반입 자체가 불법입니다. 소지 시 압수 및 벌금이 부과될 수 있습니다.",
      },
      {
        countryCode: "SG",
        countryName: "싱가포르",
        status: "prohibited",
        message:
          "싱가포르는 전자담배 소지 및 반입이 엄격히 금지되며 벌금이 부과됩니다.",
      },
      {
        countryCode: "VN",
        countryName: "베트남",
        status: "prohibited",
        message: "소량도 예외 없이 압수·처벌 대상입니다.",
      },
      {
        countryCode: "JP",
        countryName: "일본",
        status: "restricted",
        message:
          "니코틴 액상은 약사법상 개인 수입 한도(1개월분, 최대 120ml)까지만 반입 가능합니다.",
      },
      {
        countryCode: "TW",
        countryName: "대만",
        status: "prohibited",
        message:
          "전자담배 반입이 전면 금지되어 있으며 적발 시 높은 벌금이 부과됩니다.",
      },
      {
        countryCode: "HK",
        countryName: "홍콩",
        status: "prohibited",
        message:
          "전자담배 기기·액상 반입이 전면 금지됩니다. 적발 시 고액 벌금과 징역형까지 가능하며, 공공장소 소지만으로도 처벌될 수 있습니다.",
      },
      {
        countryCode: "MO",
        countryName: "마카오",
        status: "prohibited",
        message:
          "마카오는 전자담배의 반입·수입이 금지되어 있으며 적발 시 벌금이 부과됩니다.",
      },
      {
        countryCode: "IN",
        countryName: "인도",
        status: "prohibited",
        message:
          "인도는 전자담배 소지 자체가 불법입니다(니코틴 유무 무관). 환승객도 압수된 사례가 다수 있습니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "restricted",
        message:
          "니코틴 전자담배는 의사 처방전이 있어야만 반입 가능합니다(최대 3개월분). 처방전 없는 반입은 압수 대상입니다.",
      },
    ],
  },
  {
    name: "라이터/성냥",
    description: "소형 안전성냥 또는 휴대용 라이터",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason:
        "1인당 1개만 몸에 소지하여 탑승 가능합니다. 토치(터보)라이터는 기내·위탁 모두 금지됩니다.",
    },
    checked: {
      status: "prohibited",
      reason: "화재 위험으로 위탁 수하물 입고가 금지됩니다.",
    },
    keywords: ["라이터", "성냥", "불", "흡연", "지포라이터"],
    countryRestrictions: [
      {
        countryCode: "CN",
        countryName: "중국",
        status: "prohibited",
        message:
          "중국(본토)은 라이터·성냥의 기내·위탁 반입이 모두 전면 금지됩니다. 1개 소지 예외도 인정되지 않습니다.",
      },
    ],
  },

  // --- 3. 모두 금지 ---
  {
    name: "인화성 물질",
    description: "부탄가스, 휘발유, 페인트, 신나, 70% 초과 알코올",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "폭발 및 화재 위험물로 운송이 불가합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "폭발 및 화재 위험물로 운송이 불가합니다.",
    },
    keywords: [
      "부탄가스",
      "가스",
      "캠핑가스",
      "휘발유",
      "페인트",
      "신나",
      "시너",
      "에탄올",
      "석유",
      "등유",
      "라이터연료",
      "토치",
      "숯",
    ],
  },
  {
    name: "폭발물",
    description: "폭죽, 탄약, 화약류",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "위험물로 분류되어 항공 운송이 절대 불가합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "위험물로 분류되어 항공 운송이 절대 불가합니다.",
    },
    keywords: [
      "폭죽",
      "탄약",
      "총알",
      "화약",
      "다이너마이트",
      "실탄",
      "탄피",
      "탄창",
      "탄두",
      "뇌관",
    ],
  },
  {
    name: "독성·부식성 물질",
    description: "살충제, 농약, 락스, 표백제, 염산, 수은",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "독성·부식성 위험물로 기내 반입이 불가합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "독성·부식성 위험물로 위탁 운송도 불가합니다.",
    },
    keywords: [
      "살충제",
      "농약",
      "제초제",
      "락스",
      "표백제",
      "염산",
      "수은",
      "독극물",
      "에프킬라",
      "수은체온계",
    ],
  },
  {
    name: "즉석발열식품",
    description: "발열팩·발열도시락 등 자체 발열 식품",
    category: "danger",
    cabin: {
      status: "prohibited",
      reason: "발열체가 위험물로 분류되어 기내 반입이 불가합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "발열체가 위험물로 분류되어 위탁 운송도 불가합니다.",
    },
    keywords: ["즉석발열", "발열식품", "발열팩", "발열도시락"],
  },
  {
    name: "드라이아이스",
    description: "식품 보냉용 드라이아이스",
    category: "danger",
    cabin: {
      status: "restricted",
      reason:
        "식품 냉각용에 한해 1인당 2.5kg까지, 가스 배출이 가능한 포장 상태로 항공사 승인 시 반입 가능합니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "식품 냉각용에 한해 1인당 2.5kg까지, 가스 배출이 가능한 포장 상태로 항공사 승인 시 반입 가능합니다.",
    },
    keywords: ["드라이아이스"],
  },
  {
    name: "압축가스 용기",
    description: "휴대용 산소캔, 산소통, 스쿠버 공기통, 소화기",
    category: "danger",
    cabin: {
      status: "restricted",
      reason:
        "의료용 소형 산소통만 항공사 사전 승인 시 반입 가능합니다. 일반 압축가스 용기는 금지됩니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "스쿠버 공기통은 완전히 비우고 밸브를 개방한 상태만 가능합니다. 그 외 압축가스 용기는 항공사 승인이 필요합니다.",
    },
    keywords: [
      "산소통",
      "산소캔",
      "공기통",
      "스쿠버탱크",
      "소화기",
      "압축가스",
      "헬륨",
    ],
  },
  {
    name: "전동킥보드/전동휠",
    description: "전동킥보드, 전동휠, 전기자전거",
    category: "electronics",
    cabin: {
      status: "prohibited",
      reason:
        "대부분 160Wh를 초과하는 리튬배터리가 장착되어 기내 반입이 불가합니다.",
    },
    checked: {
      status: "prohibited",
      reason:
        "160Wh 초과 배터리 장착 기기는 위탁도 불가합니다. (배터리 분리형 일부 기기는 항공사 사전 승인 시 예외)",
    },
    keywords: ["전동킥보드", "전동휠", "전기자전거", "킥보드", "세그웨이"],
  },

  // --- 4. 조건부 허용 ---
  {
    name: "액체류 (화장품/세면도구)",
    description: "스킨, 로션, 샴푸, 치약, 클렌징폼",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason: "개별 100ml 이하만 가능, 총 1L 지퍼백 1개 제한.",
    },
    checked: {
      status: "allowed",
      reason: "일반 화장품·세면도구는 위탁 용량 제한이 없습니다.",
    },

    // 에어로졸(스프레이형)은 위탁 용량 제한이 따로 있어 아래 항목으로 분리
    keywords: [
      "화장품",
      "스킨",
      "로션",
      "샴푸",
      "린스",
      "치약",
      "선크림",
      "폼클렌징",
      "클렌징폼",
      "바디워시",
      "손소독제",
      "손세정제",
      "헤어젤",
      "헤어왁스",
      "왁스",
      "틴트",
      "화장수",
      "에센스",
      "세럼",
      "마스크팩",
      "아이스팩",
      "보냉팩",
      "쿨팩",
    ],
  },
  {
    name: "인화성 화장품 (에어로졸·향수)",
    description: "헤어스프레이, 데오드란트, 미스트, 향수",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason: "개별 100ml 이하만 가능, 총 1L 지퍼백 1개 제한.",
    },
    checked: {
      status: "restricted",
      reason:
        "인화성 화장품(에어로졸·향수)은 총 2L(2kg), 개당 500ml 이하만 가능합니다.",
    },
    keywords: [
      "헤어스프레이",
      "데오드란트스프레이",
      "데오드란트",
      "바디미스트",
      "미스트",
      "에어로졸",
      "향수",
      "스프레이",
      "매니큐어",
      "네일",
      "네일폴리시",
    ],
  },
  {
    name: "면도기",
    description: "일회용 면도기, 카트리지 면도기, 전기면도기",
    category: "lifestyle",
    cabin: {
      status: "allowed",
      reason: "안전날 면도기 및 전기면도기는 기내 반입이 가능합니다.",
    },
    checked: { status: "allowed", reason: "제한 없이 가능합니다." },
    keywords: ["면도기", "질레트", "도루코", "전기면도기", "세면도구"],
  },
  {
    name: "의약품",
    description: "처방약, 시럽제, 인슐린 주사, 렌즈 보존액",
    category: "medical",
    cabin: {
      status: "allowed",
      reason:
        "필요한 용량만큼 허용되며, 액체류 100ml 초과 시 처방전이 필요할 수 있습니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: [
      "약",
      "알약",
      "시럽",
      "인슐린",
      "처방약",
      "해열제",
      "감기약",
      "멀미약",
      "소화제",
      "지사제",
      "진통제",
      "렌즈액",
      "연고",
      "주사기",
      "주사바늘",
      "렌즈용액",
      "체온계",
      "혈압계",
      "혈당계",
      "콘택트렌즈",
      "안약",
      "파스",
      "반창고",
    ],
  },
  {
    name: "고데기/헤어기기",
    description: "고데기, 매직기, 헤어드라이어",
    category: "lifestyle",
    cabin: {
      status: "allowed",
      reason:
        "일반 유선형은 제한 없이 가능합니다. 가스식은 안전커버 장착 시 1인 1개, 무선(배터리형)은 기내 휴대만 가능합니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "유선형은 위탁 가능합니다. 무선(리튬배터리 내장형)과 가스식 리필 캔은 위탁이 금지됩니다.",
    },
    keywords: ["고데기", "매직기", "봉고데기", "드라이기", "헤어드라이어"],
  },
  {
    name: "드론",
    description: "촬영용 드론 및 예비 배터리",
    category: "electronics",
    cabin: {
      status: "restricted",
      reason:
        "리튬배터리(160Wh 이하)는 반드시 기내 휴대해야 합니다. 본체 기내 반입 기준은 항공사별로 다릅니다.",
    },
    checked: {
      status: "restricted",
      reason: "배터리를 분리해 기내로 휴대하면 본체는 위탁 가능합니다.",
    },
    keywords: ["드론", "매빅", "촬영드론"],
  },

  // --- 5. 일반 기내 가능 물품 ---
  {
    name: "전자기기",
    description: "노트북, 태블릿, 카메라, 이어폰, 충전기",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason: "고가품 및 배터리 포함 기기는 기내 휴대를 권장합니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "파손 위험이 크고, 배터리 내장 기기는 전원을 완전히 끈 상태로만 위탁 가능합니다. 기내 휴대를 권장합니다.",
    },
    keywords: [
      "노트북",
      "맥북",
      "태블릿",
      "아이패드",
      "카메라",
      "이어폰",
      "에어팟",
      "전자제품",
      "충전기",
      "충전케이블",
      "케이블",
      "어댑터",
      "전기장판",
      "전기포트",
      "커피포트",
      "다리미",
      "멀티탭",
      "변압기",
      "돼지코",
      "스마트워치",
      "게임기",
      "닌텐도",
      "전자책",
      "킨들",
    ],
  },
  {
    name: "생활용품",
    description: "우산, 삼각대, 손톱깎이",
    category: "lifestyle",
    cabin: {
      status: "allowed",
      reason: "끝이 뾰족하지 않은 우산이나 소형 삼각대는 가능합니다.",
    },
    checked: { status: "allowed", reason: "반입 가능합니다." },
    keywords: [
      "우산",
      "양산",
      "삼각대",
      "셀카봉",
      "손톱깎이",
      "손톱깍이",
      "지팡이",
      "물티슈",
      "바늘",
      "물병",
      "텀블러",
      "물안경",
      "물그릇",
      "골프공",
      "축구공",
      "야구공",
      "농구공",
      "풍선",
      "포크",
      "젓가락",
      "숟가락",
      "수저",
      "랜턴",
      "손전등",
      "향초",
      "양초",
      "캔들",
      "텐트",
      "침낭",
      "자물쇠",
      "안경",
      "선글라스",
      "장난감",
      "인형",
      "레고",
    ],
  },
  {
    name: "금 제품",
    description: "금목걸이, 금팔찌, 금괴, 순금 액세서리",
    category: "lifestyle",
    cabin: { status: "allowed", reason: "신고 후 반입 가능합니다." },
    checked: { status: "allowed", reason: "신고 후 반입 가능합니다." },
    keywords: ["골드", "금붙이", "액세서리", "순금", "금목걸이", "금반지"],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "restricted",
        message:
          "해외에서 새로 취득한 금 제품은 착용 여부와 무관하게 세관 신고 대상입니다(미신고 시 처벌·압수 가능). 1kg 이상 금괴는 별도 신고가 필요합니다.",
      },
    ],
  },
  // --- 검역류 (2026-09-27 추가) ---
  // 출처: 찾기쉬운 생활법령정보(식물방역법 제10조·시행규칙 제12조: "흙 또는 흙이 붙어있는 식물" 수입금지, 제47조 벌칙),
  //       日 植物防疫所(흙·흙 붙은 식물 전 지역 반입 금지), USDA APHIS(Plants in soil are prohibited, 맨뿌리 12개 이하+검역증명서),
  //       豪 DAFF(soil·pot plants)
  {
    name: "화분·흙·생화",
    description: "화분(흙 포함), 흙·배양토, 꽃다발·절화, 묘목·모종·다육이",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason:
        "보안검색은 통과 가능하나 도착국 식물검역 대상입니다. 흙이 있는 식물은 대부분 국가에서 반입 금지입니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "흙·흙이 붙은 식물은 한국 입국 시에도 수입금지품(식물방역법)입니다. 생화·묘목은 수출국 식물검역증명서와 도착 시 검역 신고가 필요합니다.",
    },
    keywords: [
      "화분",
      "흙",
      "배양토",
      "상토",
      "분갈이흙",
      "꽃다발",
      "생화",
      "절화",
      "꽃묶음",
      "묘목",
      "모종",
      "화초",
      "다육이",
      "다육식물",
      "선인장",
      "난초",
      "분재",
      "관엽식물",
      "구근",
      "알뿌리",
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "흙과 흙이 붙은 식물은 모든 국가·지역에서 반입 금지입니다. 생화·묘목도 식물검역증명서 없이는 반입 불가(3년 이하 징역 또는 300만엔 이하 벌금).",
      },
      {
        countryCode: "US",
        countryName: "미국",
        status: "prohibited",
        message:
          "흙이 있는 식물은 반입 금지입니다. 흙 없는 맨뿌리 식물만 12개 이하·식물검역증명서 지참 시 입국장 검사 후 가능합니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message:
          "흙·화분 식물은 반입할 수 없습니다. 모든 식물류는 반드시 신고해야 하며 미신고 시 고액 벌금이 부과됩니다.",
      },
    ],
  },
  // 출처: 인천공항 동식물 검역 안내(알·알가공품 신고 대상, 수출국 검역증명서 휴대 시에만 반입),
  //       日 動物検疫所(卵(卵殻を含む) 검역 대상, 検査証明書 없으면 반입 불가), US CBP/APHIS(HPAI 지역산 계란·알가공품 금지), 豪 DAFF(eggs prohibited)
  {
    name: "계란·알가공품",
    description: "생계란, 삶은 계란, 훈제란, 메추리알, 난백·난분 등 알가공품",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "보안검색은 통과 가능하나 대부분 국가에서 축산물 검역 대상입니다. 검역증명서 없이는 반입이 거부될 수 있습니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "축산물로 분류되어 도착국 검역 대상입니다. 한국 입국 시에도 알·알가공품은 신고 대상이며 수출국 검역증명서가 있어야 반입 가능합니다.",
    },
    keywords: [
      "계란",
      "달걀",
      "삶은계란",
      "삶은달걀",
      "훈제란",
      "구운계란",
      "메추리알",
      "알가공품",
      "난백",
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "계란(껍질 포함)은 동물검역 대상으로 수출국 정부 검사증명서 없이는 반입할 수 없습니다(300만엔 이하 벌금 또는 3년 이하 구금).",
      },
      {
        countryCode: "US",
        countryName: "미국",
        status: "prohibited",
        message:
          "고병원성 조류인플루엔자(HPAI) 발생 지역산 계란·알가공품은 조리된 것이라도 USDA 수입허가 없이는 반입 금지입니다. 미신고 적발 시 최대 $10,000 벌금.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message: "계란과 알 제품은 반입 금지 품목입니다.",
      },
    ],
  },
  // 출처: 찾기쉬운 생활법령정보(수산생물질병 관리법 제23조: 가공하지 않고 냉동·냉장한 전복류·굴·새우류 등 지정검역물, 말린 새우 제외),
  //       국립수산물품질관리원 휴대품검역(입국 즉시 신고), 豪 DAFF(seafood in any form must be declared)
  {
    name: "수산물 (생선·해산물)",
    description: "생선, 생선회, 조개·전복·굴, 새우, 건어물·멸치·오징어",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "생물·냉장 수산물은 얼음물이 액체류로 취급되고 냄새·누수 문제로 항공사가 거부할 수 있습니다. 건어물은 밀봉 시 가능합니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "가공하지 않은 냉동·냉장 전복·굴·새우류 등은 한국 입국 시 수산생물 검역 신고 대상입니다(말린 새우 등 건조·가공품은 제외). 도착국 검역 규정도 확인하세요.",
    },
    keywords: [
      "생선",
      "생선회",
      "횟감",
      "사시미",
      "해산물",
      "수산물",
      "조개",
      "전복",
      "생굴",
      "새우",
      "꽃게",
      "대게",
      "킹크랩",
      "랍스터",
      "건어물",
      "멸치",
      "오징어",
      "마른오징어",
      "황태",
      "북어",
    ],
    countryRestrictions: [
      {
        countryCode: "AU",
        countryName: "호주",
        status: "restricted",
        message:
          "수산물은 형태(생물·건조·냉동·조리·훈제·염장)와 무관하게 반드시 신고해야 하며, 검역관 판단에 따라 폐기될 수 있습니다.",
      },
    ],
  },
  // 출처: 日 動物検疫所(肉·臓器는 생·냉장·냉동·가열 가공품 등 형태 불문 검역 대상 → 육류 포함 사료 해당, 検査証明書 필요),
  //       豪 DAFF(pet food and treats cannot be brought in)
  {
    name: "반려동물 사료·간식",
    description: "강아지·고양이 사료, 개껌, 육포형 간식, 츄르",
    category: "food",
    cabin: {
      status: "restricted",
      reason:
        "보안검색은 통과 가능하나 육류 성분이 든 사료·간식은 축산물로 검역 대상입니다.",
    },
    checked: {
      status: "restricted",
      reason:
        "육류·유제품 성분이 포함된 사료·간식은 대부분 국가에서 검역증명서 없이는 반입이 거부됩니다. 미개봉 상업 포장이라도 검역 대상입니다.",
    },
    keywords: [
      "사료",
      "강아지사료",
      "고양이사료",
      "반려동물사료",
      "애견사료",
      "펫푸드",
      "개껌",
      "강아지간식",
      "고양이간식",
      "반려동물간식",
      "애견간식",
      "츄르",
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "육류가 포함된 사료·간식은 형태를 불문하고 동물검역 대상이며, 수출국 정부 검사증명서 없이는 반입할 수 없습니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message: "반려동물 사료와 간식은 반입 금지 품목입니다.",
      },
    ],
  },
];
