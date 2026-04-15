// 비자 요건 데이터 단일 진입점.
// - GENERATED_VISA_REQUIREMENTS: scripts/update-visa-data.mjs 가 외교부 API 에서 자동 생성
// - MANUAL_VISA_REQUIREMENTS: 외교부 데이터에 누락됐거나 부정확한 국가를 수동 보강
// 동일 ISO 코드가 양쪽에 있으면 MANUAL 이 우선.

import {
  GENERATED_VISA_REQUIREMENTS,
  type VisaRequirement,
} from "./visaRequirements.generated";

export type { VisaRequirement } from "./visaRequirements.generated";
export { VISA_DATA_FETCHED_AT } from "./visaRequirements.generated";

const MANUAL_VISA_REQUIREMENTS: Record<string, VisaRequirement> = {
  AU: {
    required: true,
    stayDays: 90,
    rawText: "ETA(전자여행허가) 필요, 무사증 90일",
    note: "출국 전 ETA(Subclass 601) 사전 신청 필수",
  },
  CA: {
    required: true,
    stayDays: 180,
    rawText: "eTA(전자여행허가) 필요, 무사증 6개월",
    note: "항공 입국 시 eTA 사전 신청 필수, 육로 입국 시 면제",
  },
  HK: {
    required: false,
    stayDays: 90,
    rawText: "무사증 90일",
    note: null,
  },
};

export const VISA_REQUIREMENTS: Record<string, VisaRequirement> = {
  ...GENERATED_VISA_REQUIREMENTS,
  ...MANUAL_VISA_REQUIREMENTS,
};
