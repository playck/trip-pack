import { useImperativeHandle, useMemo } from "react";
import type { Ref } from "react";
import { Text, VStack, Box, HStack } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";

import { AddCategorySheet, Info } from "@/shared/components";
import WeatherCard from "@/shared/components/weather/weatherCard";
import { BAGGAGE_POLICY_BY_AIR } from "@/shared/data/baggagePolicyByAir";
import { useTripFlights } from "@/features/flight/services/useFlightQueries";

import {
  useTripChecklist,
  useUpdateItemCheckedStatus,
} from "../hooks/useTripChecklist";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useListViewControls } from "../hooks/useListViewControls";
import GridView from "./GridView";
import ListView from "./ListView";
import AirlineBaggagePolicySheet from "./AirlineBaggagePolicySheet";

export interface SectionHandle {
  toggleAllCategories: () => void;
}

interface PackingSectionProps {
  ref?: Ref<SectionHandle>;
  tripId: string;
  viewMode: string;
  showUncheckedOnly: boolean;
  countryCode?: string | null;
  regionName?: string | null;
  startDate: string;
  endDate: string;
  categorySheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
  baggageSheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}

export default function PackingSection({
  ref,
  tripId,
  viewMode,
  showUncheckedOnly,
  countryCode,
  regionName,
  startDate,
  endDate,
  categorySheet,
  baggageSheet,
}: PackingSectionProps) {
  const { categories, progress } = useTripChecklist(tripId);
  const listControls = useListViewControls(categories);
  const updateItemStatus = useUpdateItemCheckedStatus(tripId);
  const createCategoryMutation = useCreateCategory(tripId, {
    onSuccess: () => categorySheet.onClose(),
  });

  useImperativeHandle(ref, () => ({
    toggleAllCategories: listControls.toggleAllCategories,
  }));

  // 항공편 수하물 규정
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

  const isShowWeatherCard = regionName && startDate && endDate;
  const isCanAddMoreCategories = categories.length < 20;

  return (
    <>
      {/* 체크율 프로그레스 */}
      <Box w="full" h="1.5" bg="gray.200" borderRadius="full" overflow="hidden">
        <Box
          h="full"
          bg="teal.500"
          borderRadius="full"
          width={`${progress.progressPercentage}%`}
          transition="width 0.3s ease"
        />
      </Box>

      {/* 여행지 날씨 정보 */}
      {isShowWeatherCard && (
        <WeatherCard
          cityName={regionName || ""}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {/* 수하물 규정 인라인 카드 */}
      {matchedBaggagePolicies.length > 0 && (
        <Info
          as="button"
          textAlign="left"
          cursor="pointer"
          onClick={baggageSheet.onOpen}
        >
          <VStack gap={1} align="stretch">
            {matchedBaggagePolicies.map((policy) => (
              <HStack key={policy.iataCode} justify="space-between">
                <HStack gap={1.5}>
                  <Text fontSize="xs" fontWeight="semibold" color="blue.700">
                    {policy.airline} {policy.iataCode}
                  </Text>
                  <Text fontSize="2xs" color="blue.500">
                    기내 {policy.cabinBaggage} · 위탁 {policy.checkedBaggage}
                  </Text>
                </HStack>
                <Box color="blue.300">
                  <ChevronRight size={14} />
                </Box>
              </HStack>
            ))}
          </VStack>
        </Info>
      )}

      {/* 수하물 규정 버튼 */}
      {matchedBaggagePolicies.length === 0 && (
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

      {/* 준비물 뷰 */}
      {viewMode === "그리드" ? (
        <GridView categories={categories} />
      ) : (
        <ListView
          categories={categories}
          onToggleItem={(itemId, isChecked) =>
            updateItemStatus.mutate({ itemId, isChecked })
          }
          countryCode={countryCode}
          showUncheckedOnly={showUncheckedOnly}
          expandedCategories={listControls.expandedCategories}
          toggleCategory={listControls.toggleCategory}
        />
      )}

      {!isCanAddMoreCategories && (
        <Box
          p={3}
          bg="orange.50"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="orange.200"
          mt={4}
        >
          <Text fontSize="sm" color="orange.700" textAlign="center">
            카테고리는 최대 20개까지 생성할 수 있습니다. ({categories.length}
            /20)
          </Text>
        </Box>
      )}

      {/* 준비물 시트 */}
      <AddCategorySheet
        isOpen={categorySheet.isOpen}
        isLoading={createCategoryMutation.isPending}
        title="준비물 카테고리 추가"
        onSave={(categoryName, iconKey) =>
          createCategoryMutation.mutate({ categoryName, iconKey })
        }
        onClose={categorySheet.onClose}
      />

      <AirlineBaggagePolicySheet
        isOpen={baggageSheet.isOpen}
        onClose={baggageSheet.onClose}
      />
    </>
  );
}
