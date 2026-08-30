import {
  VISA_REQUIREMENTS,
  type VisaRequirement,
} from "@/shared/data/visaRequirements";

// 지역 단위 예외(국가는 비자 필요지만 특정 지역만 무비자 등).
// note 를 지정하면 국가 레벨 안내 대신 이 지역 전용 문구를 노출한다.
// cn-hainan(여행사 경유 무사증)은 중국 전국 무비자 한시 시행(~2026.12.31)으로 제거 —
// 전국 정책 만료 후 하이난만 무사증으로 돌아가면 복원할 것.
const REGION_EXCEPTIONS: Record<
  string,
  { requiredOverride: boolean; note?: string }
> = {};

export interface VisaRuleResult {
  required: boolean;
  info: VisaRequirement | null;
  /** API 데이터에 해당 국가가 없어 확정이 어려운 경우 true */
  isUnknown: boolean;
  /** 지역 예외 전용 안내 문구. 있으면 국가 레벨 note 대신 우선 노출 */
  overrideNote?: string;
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
    const exception = REGION_EXCEPTIONS[regionId];
    return {
      required: exception.requiredOverride,
      info,
      isUnknown: false,
      overrideNote: exception.note,
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
  if (result.overrideNote) return result.overrideNote;
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
