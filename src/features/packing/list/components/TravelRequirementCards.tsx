import { useMemo } from "react";
import { Box, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";

import { Info } from "@/shared/components";
import { BAGGAGE_POLICY_BY_AIR } from "@/shared/data/baggagePolicyByAir";
import { getEntryDeclaration } from "@/shared/data/entryDeclarations";
import { useTripFlights } from "@/features/flight/services/useFlightQueries";
import {
  getVisaRule,
  getVisaNote,
} from "@/features/packing/create/utils/visaRules";

import AirlineBaggagePolicySheet from "./AirlineBaggagePolicySheet";
import EntryInfoSheet from "./EntryInfoSheet";

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

interface TravelRequirementCardsProps {
  tripId: string;
  countryCode?: string | null;
  regionId?: string | null;
  /** 플로팅 메뉴에서도 열려서 상위에 리프팅된 상태 */
  baggageSheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}

/** 비자·입국 정보와 항공사 수하물 규정 요약 카드 (탭하면 각 상세 시트) */
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

  const visaSummary = useMemo(() => {
    if (!isOverseasTrip) return null;
    const rule = getVisaRule(countryCode ?? undefined, regionId ?? undefined);
    const declarationHint = getEntryDeclaration(countryCode)?.required
      ? " · 입국신고 필수"
      : "";
    if (rule.isUnknown) return `비자 규정 확인 필요${declarationHint}`;
    // 지역 예외(overrideNote)는 무비자여도 별도 조건이 붙으므로 요약에 그대로 노출
    if (rule.required || rule.overrideNote)
      return `${getVisaNote(rule)}${declarationHint}`;
    const days = rule.info?.stayDays;
    return `${days ? `무비자 ${days}일` : "무비자 입국"}${declarationHint}`;
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
      {/* 비자·입국 정보 + 수하물 규정 가로 배치 (한쪽만 있으면 전체 폭 차지) */}
      {(isOverseasTrip || hasBaggagePolicies) && (
        <HStack gap={2} align="stretch">
          {isOverseasTrip && (
            <Info
              as="button"
              colorScheme="orange"
              textAlign="left"
              cursor="pointer"
              flex={1}
              minW={0}
              py={2}
              onClick={visaSheet.onOpen}
            >
              <VStack align="stretch" gap={0.5}>
                <HStack justify="space-between">
                  <Text fontSize="xs" fontWeight="semibold" color="orange.700">
                    비자·입국 정보
                  </Text>
                  <Box color="orange.300" flexShrink={0}>
                    <ChevronRight size={14} />
                  </Box>
                </HStack>
                {/* 카드가 커지지 않게 1줄 캡 — 전체 내용은 탭해서 시트에서 확인 */}
                <Text
                  fontSize="2xs"
                  color="orange.600"
                  lineHeight="1.5"
                  lineClamp={1}
                >
                  {visaSummary}
                </Text>
              </VStack>
            </Info>
          )}

          {hasBaggagePolicies && (
            <Info
              as="button"
              textAlign="left"
              cursor="pointer"
              // 수하물 문구가 비자 요약보다 길어 폭을 조금 더 준다 (한 줄 유지용)
              flex={1.25}
              minW={0}
              py={2}
              onClick={baggageSheet.onOpen}
            >
              <VStack align="stretch" gap={0.5}>
                <HStack justify="space-between">
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="blue.700"
                    lineClamp={1}
                  >
                    {matchedBaggagePolicies.length === 1
                      ? `${matchedBaggagePolicies[0].airline} ${matchedBaggagePolicies[0].iataCode}`
                      : "수하물 규정"}
                  </Text>
                  <Box color="blue.300" flexShrink={0}>
                    <ChevronRight size={14} />
                  </Box>
                </HStack>
                <VStack align="stretch" gap={0.5}>
                  {matchedBaggagePolicies.map((policy) => (
                    <Text
                      key={policy.iataCode}
                      fontSize="2xs"
                      color="blue.500"
                      lineHeight="1.5"
                      lineClamp={1}
                    >
                      {matchedBaggagePolicies.length > 1 &&
                        `${policy.iataCode} · `}
                      기내 {compactBaggageText(policy.cabinBaggage)} · 위탁{" "}
                      {compactBaggageText(policy.checkedBaggage)}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </Info>
          )}
        </HStack>
      )}

      {/* 등록된 항공편이 없으면 전체 규정을 볼 수 있는 진입점만 노출 */}
      {!hasBaggagePolicies && (
        <HStack
          as="button"
          gap={1}
          cursor="pointer"
          onClick={baggageSheet.onOpen}
        >
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            항공사별 수하물 규정
          </Text>
          <Box color="gray.400">
            <ChevronRight size={14} />
          </Box>
        </HStack>
      )}

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
