const VISA_RULES = {
  CN: { exceptions: ["cn-hainan"] },
  AU: { exceptions: [] },
} as const;

/** 비자 필요 여부 확인 */
export const checkVisaRequirement = (
  countryCode: string | undefined,
  regionId: string | undefined
): boolean => {
  if (!countryCode || !regionId) return false;

  const visaRule = VISA_RULES[countryCode as keyof typeof VISA_RULES];
  if (!visaRule) return false;

  return !(visaRule.exceptions as readonly string[]).includes(regionId);
};
