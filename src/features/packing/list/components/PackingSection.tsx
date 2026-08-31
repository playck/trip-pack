import { useImperativeHandle, useMemo } from "react";
import type { Ref } from "react";
import { Text, Box, useDisclosure } from "@chakra-ui/react";

import { AddCategorySheet } from "@/shared/components";
import WeatherCard from "@/shared/components/weather/weatherCard";

import { findCoupangDeal } from "@/shared/data/coupangDeals";
import type { CoupangDeal } from "@/shared/data/coupangDeals";

import {
  useTripChecklist,
  useUpdateItemCheckedStatus,
} from "../hooks/useTripChecklist";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useListViewControls } from "../hooks/useListViewControls";
import { getTripCountdown } from "../utils/tripCountdown";
import GridView from "./GridView";
import ListView from "./ListView";
import EntryDeclarationBanner from "./EntryDeclarationBanner";
import TravelRequirementCards from "./TravelRequirementCards";
import ImportTextSheet from "./ImportTextSheet";
import EmptyPackingCTA from "./EmptyPackingCTA";
import CoupangPrepNudge from "./CoupangPrepNudge";
import CoupangShoppingSheet from "./CoupangShoppingSheet";

export interface SectionHandle {
  toggleAllCategories: () => void;
}

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

  const { daysUntilTrip } = getTripCountdown(startDate, endDate);

  // 안 챙긴 꿀템 중 하나를 추천(목록이 바뀔 때만 다시 뽑아 깜빡임 방지)
  const suggestedDeal = useMemo(() => {
    if (coupangDeals.length === 0) return null;
    return coupangDeals[Math.floor(Math.random() * coupangDeals.length)];
  }, [coupangDeals]);

  useImperativeHandle(ref, () => ({
    toggleAllCategories: listControls.toggleAllCategories,
  }));

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

      {/* 전자 입국신고 작성 기간 배너 */}
      <EntryDeclarationBanner
        tripId={tripId}
        countryCode={countryCode}
        startDate={startDate}
        endDate={endDate}
      />

      {/* 비자·입국 정보 + 항공사 수하물 규정 요약 */}
      <TravelRequirementCards
        tripId={tripId}
        countryCode={countryCode}
        regionId={regionId}
        baggageSheet={baggageSheet}
      />

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

      <CoupangShoppingSheet
        isOpen={shoppingSheet.open}
        onClose={shoppingSheet.onClose}
        deals={coupangDeals}
      />
    </>
  );
}
