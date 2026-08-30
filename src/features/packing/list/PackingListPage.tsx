import { useState, useEffect, useCallback, useRef } from "react";
import { Container, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Settings, Share2, Minimize2, Maximize2 } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import PullToRefresh from "@/shared/components/PullToRefresh";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import {
  Checkbox,
  ErrorMessage,
  FloatingAddButton,
  ScrollToTopButton,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components/FloatingAddButton";
import { STORAGE_KEYS } from "@/shared/constants/stroage";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { colors } from "@/shared/constants/colors";
import { useScrollToTop } from "@/shared/hooks";
import { TripSettingsPanel } from "@/features/trip-settings";
import { useTodoChecklist } from "@/features/todo/list/hooks/useTodoChecklist";
import { useShoppingChecklist } from "@/features/shopping/list/hooks/useShoppingChecklist";

import { FLOATING_MENU_CONFIG } from "./constants/floatingMenu";
import { useTripChecklist } from "./hooks/useTripChecklist";
import { usePackingSheets } from "./hooks/usePackingSheets";
import {
  ViewModeToggle,
  CheckListCopySheet,
  ChecklistSaveSheet,
  TemplateListSheet,
} from "./components";
import PackingSection from "./components/PackingSection";
import ShoppingSection from "./components/ShoppingSection";
import TodoSection from "./components/TodoSection";
import type { SectionHandle } from "./components/PackingSection";

export default function PackingListPage() {
  const navigate = useNavigate();
  const sheets = usePackingSheets();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TRIP_PACK_VIEW_MODE) || "그리드";
  });
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const [showUncheckedOnly, setShowUncheckedOnly] = useState(false);

  // 준비물 (progress 표시용)
  const { categories, error, progress } = useTripChecklist(tripId);
  const { categories: todoCategories } = useTodoChecklist(tripId);
  const { categories: shoppingCategories } = useShoppingChecklist(tripId);
  const { data: tripInfo } = useTripInfo(tripId);

  const packingRef = useRef<SectionHandle>(null);
  const shoppingRef = useRef<SectionHandle>(null);
  const todoRef = useRef<SectionHandle>(null);

  const [isAllExpanded, setIsAllExpanded] = useState(true);

  const handleToggleAll = () => {
    packingRef.current?.toggleAllCategories();
    shoppingRef.current?.toggleAllCategories();
    todoRef.current?.toggleAllCategories();
    setIsAllExpanded((prev) => !prev);
  };

  const menuItems: FloatingMenuItem[] = FLOATING_MENU_CONFIG.map(
    ({ label, icon: Icon, sheetKey, group, groupLabel }) => ({
      label,
      icon: <Icon size={18} />,
      onClick: () => sheets[sheetKey].onOpen(),
      group,
      groupLabel,
    }),
  );

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["tripChecklist", tripId] }),
      queryClient.invalidateQueries({
        queryKey: ["shoppingChecklist", tripId],
      }),
      queryClient.invalidateQueries({ queryKey: ["todoChecklist", tripId] }),
    ]);
  }, [queryClient, tripId]);

  useEffect(() => {
    if (!tripId || !tripInfo) {
      navigate({ to: "/main" });
    }
  }, [tripId, tripInfo, navigate]);

  if (error) {
    return (
      <PageLayout>
        <ErrorMessage
          message={error || "알 수 없는 오류가 발생했습니다"}
          title="체크리스트 불러오기 실패"
          centered
          fullScreen
        />
      </PageLayout>
    );
  }

  if (!tripId || !tripInfo) {
    return null;
  }

  return (
    <>
      <PageLayout>
        <PullToRefresh onRefresh={handleRefresh}>
          <TripInfoHeader
            title={tripInfo.title || "여행"}
            subTitle={formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
            rightAction={
              <HStack gap={0}>
                <IconButton
                  aria-label="체크리스트 공유"
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  onClick={sheets.share.onOpen}
                >
                  <Share2 size={20} />
                </IconButton>
                <IconButton
                  aria-label="여행 설정"
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  onClick={sheets.settings.onOpen}
                >
                  <Settings size={20} />
                </IconButton>
              </HStack>
            }
          />
          <Container maxW="6xl" pt={1} pb={6} px={0}>
            <VStack gap={3} align="stretch" pb="100px">
              {/* 체크율 + 뷰 모드 토글 */}
              <HStack justify="space-between" align="center">
                <HStack gap={1.5}>
                  <Text fontSize="sm" color="gray.600">
                    체크율
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={colors.primary.fg}
                  >
                    ({progress.progressPercentage}%) {progress.checkedItems}/
                    {progress.totalItems}
                  </Text>
                </HStack>
                <ViewModeToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </HStack>

              {/* 일렬형식 컨트롤 */}
              {viewMode === "일렬형식" && (
                <HStack justify="flex-end" gap={2}>
                  <HStack
                    as="button"
                    gap={1}
                    cursor="pointer"
                    onClick={handleToggleAll}
                    color="gray.600"
                  >
                    {isAllExpanded ? (
                      <Minimize2 size={14} />
                    ) : (
                      <Maximize2 size={14} />
                    )}
                    <Text fontSize="sm">
                      {isAllExpanded ? "모두 접기" : "모두 펼치기"}
                    </Text>
                  </HStack>
                  <Checkbox
                    isChecked={showUncheckedOnly}
                    onChange={() => setShowUncheckedOnly((prev) => !prev)}
                    label="미체크만 보기"
                    size="md"
                  />
                </HStack>
              )}

              {/* 준비물 섹션 */}
              <PackingSection
                ref={packingRef}
                tripId={tripId}
                viewMode={viewMode}
                showUncheckedOnly={showUncheckedOnly}
                countryCode={tripInfo.countryCode}
                regionId={tripInfo.regionId}
                regionName={tripInfo.regionName}
                startDate={tripInfo.startDate}
                endDate={tripInfo.endDate}
                categorySheet={sheets.category}
                baggageSheet={sheets.baggage}
              />

              {/* 쇼핑 섹션 */}
              <ShoppingSection
                ref={shoppingRef}
                tripId={tripId}
                viewMode={viewMode}
                showUncheckedOnly={showUncheckedOnly}
                categorySheet={sheets.shoppingCategory}
              />

              {/* 할일 섹션 */}
              <TodoSection
                ref={todoRef}
                tripId={tripId}
                viewMode={viewMode}
                showUncheckedOnly={showUncheckedOnly}
                categorySheet={sheets.todoCategory}
              />
            </VStack>
          </Container>
        </PullToRefresh>

        <FloatingAddButton
          menuItems={menuItems}
          ariaLabel="액션 메뉴"
          topSlot={
            showScrollTop ? (
              <ScrollToTopButton onClick={scrollToTop} />
            ) : undefined
          }
        />

        <TemplateListSheet
          isOpen={sheets.template.isOpen}
          onClose={sheets.template.onClose}
          tripId={tripId}
        />

        <CheckListCopySheet
          isOpen={sheets.share.isOpen}
          categories={categories}
          onClose={sheets.share.onClose}
        />

        <ChecklistSaveSheet
          isOpen={sheets.save.isOpen}
          onClose={sheets.save.onClose}
          packingCategories={categories}
          shoppingCategories={shoppingCategories}
          todoCategories={todoCategories}
          tripInfo={tripInfo}
        />

        <TripSettingsPanel
          isOpen={sheets.settings.isOpen}
          onClose={sheets.settings.onClose}
          tripId={tripId}
        />
      </PageLayout>
    </>
  );
}
