import { useState, useEffect } from "react";
import {
  Container,
  Text,
  VStack,
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Share2,
  ChevronRight,
  Minimize2,
  Maximize2,
  Save,
  Download,
  FolderPlus,
  ShoppingCart,
  UserPlus,
  Users,
} from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import {
  AddCategorySheet,
  Checkbox,
  ErrorMessage,
  FloatingAddButton,
  ScrollToTopButton,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components/FloatingAddButton";
import WeatherCard from "@/shared/components/weather/weatherCard";
import { STORAGE_KEYS } from "@/shared/constants/stroage";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { TripActionMenu } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { useScrollToTop } from "@/shared/hooks";
import InviteSheet from "@/features/trip-members/components/InviteSheet";
import MemberListSheet from "@/features/trip-members/components/MemberListSheet";
import {
  useShoppingChecklist,
  useUpdateShoppingItemChecked,
} from "@/features/shopping/list/hooks/useShoppingChecklist";
import { useCreateShoppingCategory } from "@/features/shopping/list/hooks/useShoppingMutations";
import { useShoppingListViewControls } from "@/features/shopping/list/hooks/useShoppingListViewControls";
import ShoppingGridView from "@/features/shopping/list/components/ShoppingGridView";
import ShoppingListView from "@/features/shopping/list/components/ShoppingListView";
import {
  useTripChecklist,
  useUpdateItemCheckedStatus,
} from "./hooks/useTripChecklist";
import { useCreateCategory } from "./hooks/useCreateCategory";
import { usePackingSheets } from "./hooks/usePackingSheets";
import { useListViewControls } from "./hooks/useListViewControls";
import {
  GridView,
  ListView,
  ViewModeToggle,
  CheckListCopySheet,
  ChecklistSaveSheet,
  TemplateListSheet,
  AirlineBaggagePolicySheet,
} from "./components";

export default function PackingListPage() {
  const navigate = useNavigate();
  const sheets = usePackingSheets();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });

  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TRIP_PACK_VIEW_MODE) || "그리드";
  });
  const { showScrollTop, scrollToTop } = useScrollToTop();

  // 준비물
  const { categories, error, progress } = useTripChecklist(tripId);
  const { data: tripInfo } = useTripInfo(tripId);
  const listControls = useListViewControls(categories);
  const updateItemStatus = useUpdateItemCheckedStatus(tripId);
  const createCategoryMutation = useCreateCategory(tripId, {
    onSuccess: () => {
      sheets.category.onClose();
    },
  });

  // 쇼핑
  const {
    categories: shoppingCategories,
    error: shoppingError,
    progress: shoppingProgress,
  } = useShoppingChecklist(tripId);
  const shoppingListControls = useShoppingListViewControls(shoppingCategories);
  const updateShoppingItemStatus = useUpdateShoppingItemChecked(tripId);
  const createShoppingCategoryMutation = useCreateShoppingCategory(tripId, {
    onSuccess: () => {
      sheets.shoppingCategory.onClose();
    },
  });

  const menuItems: FloatingMenuItem[] = [
    {
      label: "체크리스트 저장",
      icon: <Save size={18} />,
      onClick: () => sheets.save.onOpen(),
    },
    {
      label: "체크리스트 가져오기",
      icon: <Download size={18} />,
      onClick: () => sheets.template.onOpen(),
    },
    {
      label: "준비물 카테고리 추가",
      icon: <FolderPlus size={18} />,
      onClick: () => sheets.category.onOpen(),
    },
    {
      label: "쇼핑 카테고리 추가",
      icon: <ShoppingCart size={18} />,
      onClick: () => sheets.shoppingCategory.onOpen(),
    },
  ];

  const isCanAddMoreCategories = categories.length < 20;
  const isShowWeatherCard =
    tripInfo?.regionName && tripInfo.startDate && tripInfo.endDate;

  const handleSaveCategory = (categoryName: string, iconKey: string) => {
    createCategoryMutation.mutate({
      categoryName,
      iconKey,
    });
  };

  const handleSaveShoppingCategory = (
    categoryName: string,
    iconKey: string,
    isShared?: boolean
  ) => {
    createShoppingCategoryMutation.mutate({
      categoryName,
      iconKey,
      isShared,
    });
  };

  const handleToggleItem = (itemId: string, isChecked: boolean) => {
    updateItemStatus.mutate({ itemId, isChecked });
  };

  const handleToggleShoppingItem = (itemId: string, isChecked: boolean) => {
    updateShoppingItemStatus.mutate({ itemId, isChecked });
  };

  useEffect(() => {
    if (!tripId || !tripInfo) {
      navigate({ to: "/main" });
    }
  }, [tripId, tripInfo, navigate]);

  if (error || shoppingError) {
    return (
      <PageLayout>
        <ErrorMessage
          message={error || shoppingError || "알 수 없는 오류가 발생했습니다"}
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
        <TripInfoHeader
          title={tripInfo.title || "여행"}
          subTitle={formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
          rightAction={
            <HStack gap={0}>
              <IconButton
                aria-label="일행 목록"
                variant="ghost"
                size="sm"
                color="gray.600"
                onClick={sheets.members.onOpen}
              >
                <Users size={20} />
              </IconButton>
              <IconButton
                aria-label="일행 초대"
                variant="ghost"
                size="sm"
                color="gray.600"
                onClick={sheets.invite.onOpen}
              >
                <UserPlus size={20} />
              </IconButton>
              <IconButton
                aria-label="공유하기"
                variant="ghost"
                size="sm"
                color="gray.600"
                onClick={sheets.share.onOpen}
              >
                <Share2 size={20} />
              </IconButton>
              <TripActionMenu
                tripId={tripId}
                tripTitle={tripInfo.title || "여행"}
                startDate={tripInfo.startDate}
                endDate={tripInfo.endDate}
              />
            </HStack>
          }
        />
        <Container maxW="6xl" pt={1} pb={6} px={0}>
          <VStack gap={3} align="stretch" pb="100px">
            {/* 체크율 + 뷰 모드 토글 */}
            <VStack align="stretch" gap={2}>
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
              <Box
                w="full"
                h="1.5"
                bg="gray.200"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  h="full"
                  bg={colors.primary.solid}
                  borderRadius="full"
                  width={`${progress.progressPercentage}%`}
                  transition="width 0.3s ease"
                />
              </Box>
            </VStack>

            {/* 여행지 날씨 정보 */}
            {isShowWeatherCard && (
              <WeatherCard
                cityName={tripInfo.regionName || ""}
                startDate={tripInfo.startDate}
                endDate={tripInfo.endDate}
              />
            )}

            {/* 툴바: 수하물 규정 + 리스트뷰 컨트롤 */}
            <HStack justify="space-between" align="center">
              <HStack
                as="button"
                gap={1}
                cursor="pointer"
                onClick={sheets.baggage.onOpen}
                _hover={{ opacity: 0.7 }}
              >
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  항공사별 수하물 규정
                </Text>
                <Box color="gray.400">
                  <ChevronRight size={14} />
                </Box>
              </HStack>

              {viewMode === "일렬형식" && (
                <HStack gap={2}>
                  <HStack
                    as="button"
                    gap={1}
                    cursor="pointer"
                    onClick={() => {
                      listControls.toggleAllCategories();
                      shoppingListControls.toggleAllCategories();
                    }}
                    color="gray.600"
                    _hover={{ opacity: 0.7 }}
                  >
                    {listControls.allExpanded &&
                    shoppingListControls.allExpanded ? (
                      <Minimize2 size={14} />
                    ) : (
                      <Maximize2 size={14} />
                    )}
                    <Text fontSize="sm">
                      {listControls.allExpanded &&
                      shoppingListControls.allExpanded
                        ? "모두 접기"
                        : "모두 펼치기"}
                    </Text>
                  </HStack>
                  <Checkbox
                    isChecked={listControls.showUncheckedOnly}
                    onChange={() =>
                      listControls.setShowUncheckedOnly((prev) => !prev)
                    }
                    label="미체크만 보기"
                    size="md"
                  />
                </HStack>
              )}
            </HStack>

            {viewMode === "그리드" ? (
              <GridView categories={categories} />
            ) : (
              <ListView
                categories={categories}
                onToggleItem={handleToggleItem}
                countryCode={tripInfo.countryCode}
                showUncheckedOnly={listControls.showUncheckedOnly}
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
                  카테고리는 최대 20개까지 생성할 수 있습니다. (
                  {categories.length}/20)
                </Text>
              </Box>
            )}

            {/* 쇼핑 리스트 섹션 */}
            {shoppingCategories.length > 0 && (
              <>
                <HStack gap={2} align="center">
                  <Box flex={1} h="1px" bg="gray.300" />
                  <HStack gap={1.5}>
                    <ShoppingCart size={16} color={colors.primary.hex[500]} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                      쇼핑 리스트
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={colors.primary.fg}
                    >
                      {shoppingProgress.checkedItems}/
                      {shoppingProgress.totalItems}
                    </Text>
                  </HStack>
                  <Box flex={1} h="1px" bg="gray.300" />
                </HStack>

                {viewMode === "그리드" ? (
                  <ShoppingGridView
                    categories={shoppingCategories}
                    tripId={tripId}
                  />
                ) : (
                  <ShoppingListView
                    categories={shoppingCategories}
                    tripId={tripId}
                    onToggleItem={handleToggleShoppingItem}
                    showUncheckedOnly={shoppingListControls.showUncheckedOnly}
                    expandedCategories={shoppingListControls.expandedCategories}
                    toggleCategory={shoppingListControls.toggleCategory}
                  />
                )}
              </>
            )}
          </VStack>
        </Container>

        <FloatingAddButton
          menuItems={menuItems}
          ariaLabel="액션 메뉴"
          topSlot={
            showScrollTop ? (
              <ScrollToTopButton onClick={scrollToTop} />
            ) : undefined
          }
        />

        <AddCategorySheet
          isOpen={sheets.category.isOpen}
          isLoading={createCategoryMutation.isPending}
          onSave={handleSaveCategory}
          onClose={sheets.category.onClose}
        />

        <AddCategorySheet
          isOpen={sheets.shoppingCategory.isOpen}
          isLoading={createShoppingCategoryMutation.isPending}
          showSharedToggle
          onSave={handleSaveShoppingCategory}
          onClose={sheets.shoppingCategory.onClose}
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
          categories={categories}
          tripInfo={tripInfo}
        />

        <AirlineBaggagePolicySheet
          isOpen={sheets.baggage.isOpen}
          onClose={sheets.baggage.onClose}
        />

        <InviteSheet
          isOpen={sheets.invite.isOpen}
          onClose={sheets.invite.onClose}
          tripId={tripId}
        />

        <MemberListSheet
          isOpen={sheets.members.isOpen}
          onClose={sheets.members.onClose}
          tripId={tripId}
        />
      </PageLayout>
    </>
  );
}
