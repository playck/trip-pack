import { useMemo } from "react";
import { Box, VStack, useDisclosure } from "@chakra-ui/react";

import { borderColors } from "@/shared/constants/colors";
import { BAGGAGE_POLICY_BY_AIR } from "@/shared/data/baggagePolicyByAir";
import { getEntryDeclaration } from "@/shared/data/entryDeclarations";
import { useTripFlights } from "@/features/flight/services/useFlightQueries";
import {
  getVisaRule,
  getVisaNote,
} from "@/features/packing/create/utils/visaRules";

import AirlineBaggagePolicySheet from "./AirlineBaggagePolicySheet";
import EntryInfoSheet from "./EntryInfoSheet";
import RequirementRow, { RequirementValue } from "./RequirementRow";

const compactBaggageText = (value: string) => {
  const paren = value.match(/\(([^)]*)\)/)?.[1];
  const outside = value.replace(/\s*\([^)]*\)/g, "").trim();

  if (!/\d/.test(outside) && paren && /\d/.test(paren)) {
    const weights = paren.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    if (weights.length > 0) {
      const min = Math.min(...weights);
      const max = Math.max(...weights);
      return min === max ? `${max}KG` : `${min}~${max}KG`;
    }
  }

  return outside
    .replace(/^1개\s*\/\s*/, "") // 1개는 기본값이라 생략 (2개 이상은 유지)
    .replace(/개인휴대품/g, "휴대품")
    .replace(/\s*([/~+])\s*/g, "$1")
    .replace(/\s*[Xx]\s*(?=\d)/, "X") // "2개 X 23KG" → "2개X23KG"
    .replace(/(\d)\s*개\s*합계\s*/, "$1개 ")
    .replace(/^운임\s+/, "") // "운임 등급별 상이" → "등급별 상이"
    .replace(/\s*(필수|필요)$/, "") // "유료 구매 필수" → "유료 구매"
    .trim();
};

/** "파라타항공(구 플라이강원)" → "파라타항공". 괄호 병기는 줄바꿈만 유발해 요약에선 생략 */
const compactAirlineName = (value: string) =>
  value.replace(/\s*\([^)]*\)/g, "").trim();

interface TravelRequirementCardsProps {
  tripId: string;
  countryCode?: string | null;
  regionId?: string | null;
  /** 플로팅 메뉴에서도 열려서 상위에 리프팅된 상태 */
  baggageSheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}

/** 비자·입국 정보와 항공사 수하물 규정 리드아웃 (탭하면 각 상세 시트) */
export default function TravelRequirementCards({
  tripId,
  countryCode,
  regionId,
  baggageSheet,
}: TravelRequirementCardsProps) {
  const visaSheet = useDisclosure();

  const isOverseasTrip = Boolean(
    countryCode && countryCode.toUpperCase() !== "KR",
  );

  // 값은 짧은 상태값으로, 긴 원문은 detail로 분리 — 값 컬럼이 스캔 가능하게 유지된다
  const visa = useMemo(() => {
    if (!isOverseasTrip) return null;

    const rule = getVisaRule(countryCode ?? undefined, regionId ?? undefined);
    const declarationBadge = getEntryDeclaration(countryCode)?.required
      ? "입국신고 필수"
      : undefined;

    if (rule.isUnknown) {
      return {
        text: "규정 확인 필요",
        tone: "attention" as const,
        detail: "외교부 해외안전여행에서 최신 규정 확인",
        badge: declarationBadge,
      };
    }

    // 지역 예외는 무비자여도 별도 조건이 붙으므로 예외 문구를 그대로 노출
    if (rule.overrideNote) {
      return {
        text: "조건부 입국",
        tone: "attention" as const,
        detail: rule.overrideNote,
        badge: declarationBadge,
      };
    }

    if (rule.required) {
      return {
        text: "비자 필요",
        tone: "attention" as const,
        detail: getVisaNote(rule),
        badge: declarationBadge,
      };
    }

    const days = rule.info?.stayDays;
    return {
      text: days ? `무비자 ${days}일` : "무비자 입국",
      tone: "default" as const,
      detail: null,
      badge: declarationBadge,
    };
  }, [isOverseasTrip, countryCode, regionId]);

  // 등록된 항공편의 편명 앞 2자리로 항공사 규정을 매칭 (중복 제거)
  const { data: tripFlights = [] } = useTripFlights(tripId);
  const matchedBaggagePolicies = useMemo(() => {
    const policyMap = new Map(
      BAGGAGE_POLICY_BY_AIR.map((p) => [p.iataCode, p]),
    );
    const seen = new Set<string>();
    return tripFlights
      .map((flight) => {
        const iataCode = flight.flight_id.slice(0, 2).toUpperCase();
        if (seen.has(iataCode)) return null;
        seen.add(iataCode);
        return policyMap.get(iataCode) ?? null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [tripFlights]);

  const hasBaggagePolicies = matchedBaggagePolicies.length > 0;

  return (
    <>
      <Box
        borderWidth="1px"
        borderColor={borderColors.default}
        borderRadius="lg"
        bg="white"
        overflow="hidden"
      >
        {visa && (
          <RequirementRow label="비자" onClick={visaSheet.onOpen}>
            <RequirementValue
              text={visa.text}
              tone={visa.tone}
              badge={visa.badge}
              detail={visa.detail}
            />
          </RequirementRow>
        )}

        {/* 항공편이 등록됐으면 실제 규정을, 아니면 전체 규정 진입점을 같은 자리에 */}
        <RequirementRow label="수하물" onClick={baggageSheet.onOpen}>
          {hasBaggagePolicies ? (
            <VStack align="stretch" gap={1.5}>
              {matchedBaggagePolicies.map((policy) => (
                <RequirementValue
                  key={policy.iataCode}
                  prefix={compactAirlineName(policy.airline)}
                  text={`기내 ${compactBaggageText(policy.cabinBaggage)} · 위탁 ${compactBaggageText(policy.checkedBaggage)}`}
                />
              ))}
            </VStack>
          ) : (
            <RequirementValue text="항공사별 규정 보기" tone="muted" />
          )}
        </RequirementRow>
      </Box>

      <AirlineBaggagePolicySheet
        isOpen={baggageSheet.isOpen}
        onClose={baggageSheet.onClose}
      />

      <EntryInfoSheet
        isOpen={visaSheet.open}
        onClose={visaSheet.onClose}
        countryCode={countryCode}
        regionId={regionId}
      />
    </>
  );
}
