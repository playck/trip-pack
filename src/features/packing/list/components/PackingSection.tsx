import { useImperativeHandle, useMemo } from "react";
import type { Ref } from "react";
import { Text, VStack, Box, HStack, useDisclosure } from "@chakra-ui/react";
import { ChevronRight, CircleAlert } from "lucide-react";

import { AddCategorySheet, Info } from "@/shared/components";
import WeatherCard from "@/shared/components/weather/weatherCard";
import dayjs from "dayjs";

import { BAGGAGE_POLICY_BY_AIR } from "@/shared/data/baggagePolicyByAir";
import { findCoupangDeal } from "@/shared/data/coupangDeals";
import type { CoupangDeal } from "@/shared/data/coupangDeals";
import {
  getEntryDeclaration,
  isDeclarationWindowOpen,
} from "@/shared/data/entryDeclarations";
import {
  ENTRY_DECLARATION_GUIDE_KEY,
  ESSENTIAL_CATEGORY_NAME,
  findEssentialGuide,
} from "@/shared/data/essentialItemGuides";
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
import EntryInfoSheet from "./EntryInfoSheet";
import EssentialItemGuideSheet from "./EssentialItemGuideSheet";
import {
  getVisaRule,
  getVisaNote,
} from "@/features/packing/create/utils/visaRules";
import ImportTextSheet from "./ImportTextSheet";
import EmptyPackingCTA from "./EmptyPackingCTA";
import CoupangPrepNudge from "./CoupangPrepNudge";
import CoupangShoppingSheet from "./CoupangShoppingSheet";

export interface SectionHandle {
  toggleAllCategories: () => void;
}

// 반폭 요약 카드용: 괄호 노트 제거 + "1개 / 10KG" → "1개/10KG" 압축 (전체 문구는 시트에서 노출)
const compactBaggageText = (value: string) =>
  value
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*\/\s*/g, "/")
    .trim();

interface PackingSectionProps {
  ref?: Ref<SectionHandle>;
  tripId: string;
  viewMode: string;
  showUncheckedOnly: boolean;
  countryCode?: string | null;
  regionId?: string | null;
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
  regionId,
  regionName,
  startDate,
  endDate,
  categorySheet,
  baggageSheet,
}: PackingSectionProps) {
  const { categories, progress } = useTripChecklist(tripId);
  const listControls = useListViewControls(categories);
  const updateItemStatus = useUpdateItemCheckedStatus(tripId);
  const textImport = useDisclosure();
  const shoppingSheet = useDisclosure();
  const visaSheet = useDisclosure();
  const declarationSheet = useDisclosure();
  const createCategoryMutation = useCreateCategory(tripId, {
    onSuccess: () => categorySheet.onClose(),
  });

  // 안 챙긴(미체크) 꿀템 = 쿠팡 모아보기 대상 (중복 제거)
  const coupangDeals = useMemo<CoupangDeal[]>(() => {
    const map = new Map<string, CoupangDeal>();
    categories.forEach((category) => {
      category.items?.forEach((item) => {
        if (item.is_checked) return;
        const deal = findCoupangDeal(item.name);
        if (deal && !map.has(deal.itemName)) map.set(deal.itemName, deal);
      });
    });
    return Array.from(map.values());
  }, [categories]);

  // 웹뷰가 살아있는 채 날짜가 바뀔 수 있어 메모이제이션하지 않고 렌더마다 계산한다
  const today = dayjs().startOf("day");
  const daysUntilTrip = dayjs(startDate).startOf("day").diff(today, "day");
  const daysUntilTripEnd = dayjs(endDate || startDate)
    .startOf("day")
    .diff(today, "day");

  // 안 챙긴 꿀템 중 하나를 추천(목록이 바뀔 때만 다시 뽑아 깜빡임 방지)
  const suggestedDeal = useMemo(() => {
    if (coupangDeals.length === 0) return null;
    return coupangDeals[Math.floor(Math.random() * coupangDeals.length)];
  }, [coupangDeals]);

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

  // 비자·입국 정보 (해외 여행일 때만)
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

  // 전자 입국신고: 작성 창이 열렸고 아이템이 미체크일 때만 배너 노출
  const entryDeclaration = useMemo(
    () => getEntryDeclaration(countryCode),
    [countryCode],
  );
  // 이름을 바꿔도 찾도록 정확 일치 대신 가이드 매칭으로 판정(가이드 pill과 동일 기준)
  const declarationItem = useMemo(() => {
    if (!entryDeclaration) return null;
    const essential = categories.find(
      (category) => category.name === ESSENTIAL_CATEGORY_NAME,
    );
    return (
      essential?.items?.find(
        (item) =>
          findEssentialGuide(item.name)?.key === ENTRY_DECLARATION_GUIDE_KEY,
      ) ?? null
    );
  }, [categories, entryDeclaration]);
  const showDeclarationBanner =
    !!entryDeclaration &&
    !!declarationItem &&
    !declarationItem.is_checked &&
    isDeclarationWindowOpen(entryDeclaration, daysUntilTrip, daysUntilTripEnd);

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

      {/* 전자 입국신고 작성 기간 배너 */}
      {showDeclarationBanner && entryDeclaration && (
        <Info
          as="button"
          colorScheme="orange"
          textAlign="left"
          cursor="pointer"
          onClick={declarationSheet.onOpen}
        >
          <HStack justify="space-between">
            <HStack gap={1.5} align="start">
              <Box color="orange.500" mt="1px">
                <CircleAlert size={15} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="orange.700">
                  {entryDeclaration.name} 작성 가능 기간이에요
                </Text>
                <Text fontSize="2xs" color="orange.600">
                  {entryDeclaration.deadline} · 도착 전 필수
                </Text>
              </VStack>
            </HStack>
            <Box color="orange.300">
              <ChevronRight size={14} />
            </Box>
          </HStack>
        </Info>
      )}

      {/* 비자·입국 정보 + 수하물 규정 가로 배치 (한쪽만 있으면 전체 폭 차지) */}
      {(isOverseasTrip || matchedBaggagePolicies.length > 0) && (
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

          {matchedBaggagePolicies.length > 0 && (
            <Info
              as="button"
              textAlign="left"
              cursor="pointer"
              flex={1}
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
                        `${policy.airline} ${policy.iataCode} · `}
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

      {/* 준비물 뷰 (본인 카테고리 0개면 빈 상태 CTA) */}
      {categories.length === 0 ? (
        <EmptyPackingCTA tripId={tripId} />
      ) : (
        <>
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
          {suggestedDeal && daysUntilTrip >= 0 && (
            <CoupangPrepNudge deal={suggestedDeal} onClick={shoppingSheet.onOpen} />
          )}
        </>
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
        onTextImport={() => {
          categorySheet.onClose();
          // Drawer 닫힘 애니메이션이 끝난 뒤 다음 시트를 열어야
          // backdrop/포커스 트랩 충돌로 autoFocus가 꺼지는 것을 방지
          setTimeout(() => textImport.onOpen(), 250);
        }}
      />

      <ImportTextSheet
        isOpen={textImport.open}
        onClose={textImport.onClose}
        tripId={tripId}
        defaultType="packing"
      />

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

      <EssentialItemGuideSheet
        isOpen={declarationSheet.open}
        onClose={declarationSheet.onClose}
        item={declarationItem}
        countryCode={countryCode}
        onToggleCheck={(itemId, isChecked) =>
          updateItemStatus.mutate({ itemId, isChecked })
        }
      />

      <CoupangShoppingSheet
        isOpen={shoppingSheet.open}
        onClose={shoppingSheet.onClose}
        deals={coupangDeals}
      />
    </>
  );
}
