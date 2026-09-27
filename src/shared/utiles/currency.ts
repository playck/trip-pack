/** 국가 코드(ISO 3166-1 alpha-2, 일부 자체 지역 코드) → 통화 코드(ISO 4217) */
export const CURRENCY_BY_COUNTRY: Record<string, string> = {
  // 아시아
  KR: "krw", // 한국
  JP: "jpy", // 일본
  CN: "cny", // 중국
  TW: "twd", // 대만
  HK: "hkd", // 홍콩
  MO: "mop", // 마카오
  VN: "vnd", // 베트남
  TH: "thb", // 태국
  PH: "php", // 필리핀
  SG: "sgd", // 싱가포르
  ID: "idr", // 인도네시아
  MY: "myr", // 말레이시아
  LA: "lak", // 라오스
  KH: "khr", // 캄보디아
  MN: "mnt", // 몽골
  IMN: "cny", // 내몽골 (중국 지역 코드)
  IN: "inr", // 인도
  NP: "npr", // 네팔
  LK: "lkr", // 스리랑카
  MV: "usd", // 몰디브 (공식 통화는 MVR이지만 리조트 결제는 달러 중심)
  UZ: "uzs", // 우즈베키스탄
  KZ: "kzt", // 카자흐스탄
  KG: "kgs", // 키르기스스탄

  // 중동
  AE: "aed", // 아랍에미리트
  SA: "sar", // 사우디아라비아
  OM: "omr", // 오만
  JO: "jod", // 요르단

  // 미주
  US: "usd", // 미국
  CA: "cad", // 캐나다
  MX: "mxn", // 멕시코
  BR: "brl", // 브라질
  AR: "ars", // 아르헨티나
  PE: "pen", // 페루
  CL: "clp", // 칠레

  // 유럽 (유로존 국가들)
  FR: "eur", // 프랑스
  DE: "eur", // 독일
  IT: "eur", // 이탈리아
  ES: "eur", // 스페인
  PT: "eur", // 포르투갈
  NL: "eur", // 네덜란드
  BE: "eur", // 벨기에
  AT: "eur", // 오스트리아
  GR: "eur", // 그리스
  FI: "eur", // 핀란드
  IE: "eur", // 아일랜드
  HR: "eur", // 크로아티아 (2023년 유로 도입)
  SI: "eur", // 슬로베니아
  EE: "eur", // 에스토니아
  LV: "eur", // 라트비아
  LT: "eur", // 리투아니아

  // 유럽 (비유로존)
  GB: "gbp", // 영국
  CH: "chf", // 스위스
  SE: "sek", // 스웨덴
  NO: "nok", // 노르웨이
  DK: "dkk", // 덴마크
  CZ: "czk", // 체코
  HU: "huf", // 헝가리
  PL: "pln", // 폴란드
  TR: "try", // 터키
  RU: "rub", // 러시아
  RO: "ron", // 루마니아
  IS: "isk", // 아이슬란드
  GE: "gel", // 조지아
  AZ: "azn", // 아제르바이잔
  AM: "amd", // 아르메니아

  // 아프리카
  EG: "egp", // 이집트
  MA: "mad", // 모로코
  TN: "tnd", // 튀니지
  KE: "kes", // 케냐
  TZ: "tzs", // 탄자니아
  ZA: "zar", // 남아프리카공화국

  // 오세아니아
  AU: "aud", // 호주
  NZ: "nzd", // 뉴질랜드
  GU: "usd", // 괌 (미국 달러 사용)
  MP: "usd", // 사이판 (미국 달러 사용)
};

/**
 * 국가 코드(ISO 3166-1 alpha-2)를 기반으로 통화 코드(ISO 4217)를 반환
 * @param countryCode 국가 코드
 * @returns 통화 코드
 */
export const getCurrencyByCountryCode = (
  countryCode: string | null | undefined
): string => {
  if (!countryCode) return "usd";

  return CURRENCY_BY_COUNTRY[countryCode.toUpperCase()] || "usd"; // 매핑되지 않은 국가는 USD 반환
};

/**
 * 통화 코드에 따른 심볼을 반환
 * @param currencyCode 통화 코드
 * @returns symbol
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  const code = currencyCode.toLowerCase();

  const symbolMap: Record<string, string> = {
    usd: "$",
    krw: "₩",
    jpy: "¥",
    cny: "¥",
    eur: "€",
    gbp: "£",
    twd: "NT$",
    hkd: "HK$",
    vnd: "₫",
    thb: "฿",
    php: "₱",
    inr: "₹",
  };

  return symbolMap[code] || code.toUpperCase();
};
