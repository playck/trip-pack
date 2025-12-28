type TransportStatus = "allowed" | "prohibited" | "restricted";

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
    ],
  },
  {
    name: "가공육 및 육류",
    description: "육포, 소시지, 햄, 장조림, 순대, 족발",
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
    ],
    countryRestrictions: [
      {
        countryCode: "JP",
        countryName: "일본",
        status: "prohibited",
        message:
          "일본은 가공육 반입을 엄격히 금지하며, 적발 시 압수 및 과태료가 발생합니다.",
      },
      {
        countryCode: "US",
        countryName: "미국",
        status: "prohibited",
        message:
          "모든 종류의 육류(소, 돼지, 닭 등) 성분이 든 식품은 반입이 금지됩니다.",
      },
      {
        countryCode: "AU",
        countryName: "호주",
        status: "prohibited",
        message:
          "호주는 모든 육류 제품의 반입이 엄격히 금지됩니다. 반드시 신고해야 합니다.",
      },
      {
        countryCode: "TW",
        countryName: "대만",
        status: "prohibited",
        message:
          "육가공품(소시지, 햄, 라면 스프 등) 반입 적발 시 매우 높은 벌금이 부과됩니다.",
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
      "생고기",
      "농산물",
      "검역",
      "식물",
      "씨앗",
      "망고",
      "사과",
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
    name: "즉석밥 및 액상 식품",
    description: "햇반, 컵반, 죽, 푸딩 등 수분이 포함된 식품",
    category: "food",
    cabin: {
      status: "prohibited",
      reason: "액체/젤류 규정으로 인해 100ml 초과 시 기내 반입이 불가합니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 반입 가능합니다." },
    keywords: ["햇반", "즉석밥", "오뚜기밥", "컵반", "죽", "푸딩"],
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
    ],
  },
  {
    name: "가위",
    description: "날 길이 6cm를 초과하는 가위",
    category: "tools",
    cabin: {
      status: "prohibited",
      reason: "긴 날을 가진 가위는 기내 반입이 불가합니다.",
    },
    checked: { status: "allowed", reason: "위탁 수하물로 가능합니다." },
    keywords: ["가위", "문구용가위", "주방가위", "학용품"],
  },
  {
    name: "공구류",
    description: "망치, 드릴, 스패너, 렌치 (길이 10cm 초과)",
    category: "tools",
    cabin: {
      status: "prohibited",
      reason: "둔기로 사용될 수 있는 공구는 기내 반입이 불가합니다.",
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
    ],
  },

  // --- 2. 위탁 금지 물품 (기내 휴대 필수) ---
  {
    name: "보조배터리",
    description: "보조배터리, 리튬이온 배터리 (160Wh 이하)",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason: "160Wh 이하 배터리는 기내 휴대만 가능합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "화재 위험으로 위탁 수하물 반입이 절대 금지됩니다.",
    },
    keywords: [
      "보조배터리",
      "배터리",
      "리튬배터리",
      "충전기",
      "파워뱅크",
      "휴대폰배터리",
    ],
    countryRestrictions: [
      {
        countryCode: "CN",
        countryName: "중국",
        status: "restricted",
        message:
          "중국 공항은 배터리 용량 표기가 지워진 경우 무조건 압수하며 규정이 매우 까다롭습니다.",
      },
    ],
  },
  {
    name: "전자담배",
    description: "궐련형, 액상형 전자담배 기기",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason: "기내 휴대만 가능하며, 기내 사용/충전은 금지됩니다.",
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
        status: "restricted",
        message:
          "액상 니코틴 함량에 따라 제한이 있을 수 있으나 소량은 통과됩니다.",
      },
      {
        countryCode: "JP",
        countryName: "일본",
        status: "restricted",
        message: "니코틴이 포함된 액상은 120ml까지만 면세 반입이 가능합니다.",
      },
      {
        countryCode: "TW",
        countryName: "대만",
        status: "prohibited",
        message:
          "전자담배 반입이 전면 금지되어 있으며 적발 시 높은 벌금이 부과됩니다.",
      },
    ],
  },
  {
    name: "라이터/성냥",
    description: "소형 안전성냥 또는 휴대용 라이터",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason: "1인당 1개만 몸에 소지하여 탑승 가능합니다.",
    },
    checked: {
      status: "prohibited",
      reason: "화재 위험으로 위탁 수하물 입고가 금지됩니다.",
    },
    keywords: ["라이터", "성냥", "불", "흡연", "지포라이터"],
  },

  // --- 3. 모두 금지 ---
  {
    name: "인화성 물질",
    description: "부탄가스, 휘발유, 페인트, 알코올(70% 이상)",
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
      "기름",
      "페인트",
      "알코올",
      "신나",
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
    keywords: ["폭죽", "탄약", "총알", "화약", "다이너마이트"],
  },

  // --- 4. 조건부 허용 ---
  {
    name: "액체류 (화장품/세면도구)",
    description: "스킨, 로션, 샴푸, 향수, 치약, 헤어스프레이",
    category: "lifestyle",
    cabin: {
      status: "restricted",
      reason: "개별 100ml 이하만 가능, 총 1L 지퍼백 1개 제한.",
    },
    checked: {
      status: "allowed",
      reason: "인당 총 2kg(2L) 이내에서 반입 가능합니다.",
    },
    keywords: [
      "화장품",
      "스킨",
      "로션",
      "향수",
      "샴푸",
      "린스",
      "치약",
      "헤어스프레이",
      "미스트",
      "선크림",
      "데오드란트",
      "데오드란트스프레이",
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
    keywords: ["약", "알약", "시럽", "인슐린", "처방약", "해열제", "렌즈액"],
  },

  // --- 5. 일반 기내 가능 물품 ---
  {
    name: "전자기기",
    description: "노트북, 태블릿, 카메라, 이어폰",
    category: "electronics",
    cabin: {
      status: "allowed",
      reason: "고가품 및 배터리 포함 기기는 기내 휴대를 권장합니다.",
    },
    checked: {
      status: "restricted",
      reason: "파손 위험이 크며, 배터리 용량에 따라 위탁이 불가할 수 있습니다.",
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
          "일본은 금 제품 반입에 매우 엄격합니다. 착용 중인 금장신구도 신고 대상이며 미신고 시 압수될 수 있습니다.",
      },
    ],
  },
];
