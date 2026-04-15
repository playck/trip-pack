import {
  VISA_REQUIREMENTS,
  type VisaRequirement,
} from "@/shared/data/visaRequirements";

// 지역 단위 예외(국가는 비자 필요지만 특정 지역만 무비자 등).
const REGION_EXCEPTIONS: Record<string, { requiredOverride: boolean }> = {
  "cn-hainan": { requiredOverride: false },
};

export interface VisaRuleResult {
  required: boolean;
  info: VisaRequirement | null;
  /** API 데이터에 해당 국가가 없어 확정이 어려운 경우 true */
  isUnknown: boolean;
}

const UNKNOWN_NOTE =
  "외교부 해외안전여행(0404.go.kr)에서 최신 비자 규정 확인 필수";

/** 비자 필요 여부 + 상세 정보 */
export const getVisaRule = (
  countryCode: string | undefined,
  regionId: string | undefined,
): VisaRuleResult => {
  if (!countryCode) {
    return { required: false, info: null, isUnknown: false };
  }

  const code = countryCode.toUpperCase();
  const info = VISA_REQUIREMENTS[code] ?? null;

  if (regionId && REGION_EXCEPTIONS[regionId]) {
    return {
      required: REGION_EXCEPTIONS[regionId].requiredOverride,
      info,
      isUnknown: false,
    };
  }

  if (!info) {
    return { required: true, info: null, isUnknown: true };
  }

  return {
    required: info.required !== false,
    info,
    isUnknown: false,
  };
};

export const getVisaNote = (result: VisaRuleResult): string => {
  if (result.isUnknown) return UNKNOWN_NOTE;

  const info = result.info;
  if (!info) return UNKNOWN_NOTE;

  if (result.required) {
    if (info.rawText && info.rawText !== "X") {
      const extra = info.note ? ` · ${info.note}` : "";
      return `${info.rawText}${extra}`;
    }
    return UNKNOWN_NOTE;
  }

  // 비자 불필요 → 무사증 안내
  if (info.rawText) {
    const text = info.rawText.startsWith("무사증")
      ? info.rawText
      : `무사증 ${info.rawText}`;
    return `비자 불필요 (${text} 입국 가능)`;
  }
  return "비자 불필요";
};
