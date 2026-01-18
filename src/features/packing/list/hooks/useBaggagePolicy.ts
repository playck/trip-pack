import { useMemo } from "react";
import type { CabinPolicy } from "@/shared/data/checkList";
import { checkBaggageRule } from "@/shared/utils/baggageChecker";
import type { CountryRestriction } from "@/shared/data/baggagePolicyData";
import type { ChecklistItem } from "../../type";

interface UseBaggagePolicyResult {
  cabinPolicy: CabinPolicy | null;
  cabinNotes: string | null;
  checkedPolicy: CabinPolicy | null;
  checkedNotes: string | null;
  isRuleMatched: boolean;
  countryWarning: CountryRestriction | null;
}

/**
 * 아이템 정보(이름, 데이터)를 기반으로 최종적으로 표시할 기내/위탁 수하물 정책을 결정
 * 또한 여행 국가(country_code)에 따른 특별 규정도 함께 검사
 */
export const useBaggagePolicy = (
  item: ChecklistItem | null | undefined,
  targetCountryCode?: string | null
): UseBaggagePolicyResult => {
  return useMemo(() => {
    if (!item) {
      return {
        cabinPolicy: null,
        cabinNotes: null,
        checkedPolicy: null,
        checkedNotes: null,
        isRuleMatched: false,
        countryWarning: null,
      };
    }

    // 1. 실시간 규정 검색
    const baggageRule = checkBaggageRule(item.name);

    // 2. 기내 반입 정책 결정 (실시간 검색 결과 우선, 없으면 DB 값)
    let finalCabinPolicy = (baggageRule?.item.cabin.status ||
      item.cabin_policy) as CabinPolicy;

    // 3. 위탁 수하물 정책 결정 (실시간 검색 결과 우선)
    let finalCheckedPolicy = baggageRule?.item.checked.status as CabinPolicy;

    // 4. 기내 반입은 가능(allowed)하지만 위탁이 금지(prohibited)된 경우
    if (finalCheckedPolicy === "prohibited" && finalCabinPolicy === "allowed") {
      finalCabinPolicy = "restricted";
    }

    // 5. 국가별 규정 검사
    let countryWarning: CountryRestriction | null = null;
    if (baggageRule?.item.countryRestrictions && targetCountryCode) {
      const restriction = baggageRule.item.countryRestrictions.find(
        (r) => r.countryCode === targetCountryCode
      );

      if (restriction) {
        countryWarning = restriction;
        // 국가 금지 품목이면 'prohibited'(금지)로 상태 변경
        if (restriction.status === "prohibited") {
          finalCabinPolicy = "prohibited";
          finalCheckedPolicy = "prohibited";
        } else if (restriction.status === "restricted") {
          // 주의가 필요한 경우 'restricted'로 설정
          if (finalCabinPolicy === "allowed") finalCabinPolicy = "restricted";
          if (finalCheckedPolicy === "allowed")
            finalCheckedPolicy = "restricted";
        }
      }
    }

    // 6. 메모 결정
    const finalCabinNotes = baggageRule?.item.cabin.reason || item.cabin_notes;
    const finalCheckedNotes = baggageRule?.item.checked.reason || null;

    return {
      cabinPolicy: finalCabinPolicy,
      cabinNotes: finalCabinNotes,
      checkedPolicy: finalCheckedPolicy,
      checkedNotes: finalCheckedNotes,
      isRuleMatched: !!baggageRule,
      countryWarning,
    };
  }, [item?.name, item?.cabin_policy, item?.cabin_notes, targetCountryCode]);
};
