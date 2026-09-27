// 무비자로 입국해도 출발 전 따로 받아야 하는 전자여행허가 (자체 작성 데이터).
// 여행 필수 정보라 공식 출처로 확인한 것만 넣는다 — 확인일 2026-09-27
// - 미국 ESTA: DHS "Visa Waiver Program"(Korea, Republic of 2008-11-17 참여 · 항공기·선박 탑승 전 ESTA 승인 필수),
//   CBP "ESTA" 안내(여행 준비를 시작할 때·항공권 구매 전 신청 권장, 신청은 esta.cbp.dhs.gov)
// - 괌·사이판은 별도 면제 제도(Guam-CNMI VWP)가 있어 제외. 영국 ETA·뉴질랜드 NZeTA는 공식 확인 후 추가.

export interface TravelAuthorization {
  /** 체크리스트 아이템명 */
  name: string;
  /** 여행 요건 배지용 축약명 */
  shortName: string;
  note: string;
  /** 같은 국가 코드지만 이 제도를 적용하지 않는 지역 id */
  excludedRegionIds?: string[];
}

const TRAVEL_AUTHORIZATIONS: Record<string, TravelAuthorization> = {
  US: {
    name: "ESTA 전자여행허가",
    shortName: "ESTA",
    note: "무비자(비자 면제 프로그램)여도 탑승 전 승인 필수 · 여행 준비를 시작할 때 신청 권장 (esta.cbp.dhs.gov)",
    excludedRegionIds: ["us-guam", "us-saipan"],
  },
};

export function getTravelAuthorization(
  countryCode?: string | null,
  regionId?: string | null,
): TravelAuthorization | null {
  if (!countryCode) return null;
  const authorization = TRAVEL_AUTHORIZATIONS[countryCode.toUpperCase()];
  if (!authorization) return null;
  if (regionId && authorization.excludedRegionIds?.includes(regionId)) {
    return null;
  }
  return authorization;
}
