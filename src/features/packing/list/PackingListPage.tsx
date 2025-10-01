import { useState } from "react";
import {
  Container,
  Text,
  VStack,
  HStack,
  SegmentGroup,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { Grid3X3, List } from "lucide-react";
import { useParams, useSearch } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import {
  BottomSheet,
  ErrorMessage,
  FloatingAddButton,
  LoadingSpinner,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components/FloatingAddButton";
import WeatherCard from "@/shared/components/weather/weatherCard";
import { STORAGE_KEYS } from "@/shared/constants/stroage";
import { useTripInfo } from "@/shared/hooks/useTripQuery";

import {
  ProgressBar,
  CheckListCopySheet,
  CategoryForm,
  GridView,
  ListView,
  TripTitle,
} from "./components";
import { useTripChecklist } from "./hooks/useTripChecklist";
import { useCreateCategory } from "./hooks/useCreateCategory";

export default function PackingListPage() {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const {
    open: isCheckListCopyOpen,
    onOpen: onCheckListCopyOpen,
    onClose: onCheckListCopyClose,
  } = useDisclosure();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const search = useSearch({ from: "/packing/list/$tripId" }) as {
    tripTitle?: string;
  };
  const initialTripTitle = search?.tripTitle || "여행";
  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TRIP_PACK_VIEW_MODE) || "그리드";
  });
  const { categories, isLoading, error, progress } = useTripChecklist(tripId);
  const { data: tripInfo } = useTripInfo(tripId);

  const createCategoryMutation = useCreateCategory(tripId, {
    onSuccess: () => {
      onClose();
    },
  });

  const isCanAddMoreCategories = categories.length < 15;
  const isShowWeatherCard =
    tripInfo?.regionName && tripInfo.startDate && tripInfo.endDate;

  const handleSaveCategory = (newCategory: {
    categoryName: string;
    iconKey: string;
  }) => {
    createCategoryMutation.mutate(newCategory);
  };

  const handleCancelCategoryCreate = () => {
    onClose();
  };

  const menuItems: FloatingMenuItem[] = [
    {
      label: "체크리스트 저장",
      onClick: () => {
        // TODO: 체크리스트 저장 로직 구현
        console.log("체크리스트 저장");
      },
    },
    {
      label: "체크리스트 가져오기",
      onClick: () => {
        onCheckListCopyOpen();
      },
    },
    {
      label: "카테고리 추가",
      onClick: () => {
        onOpen();
      },
    },
  ];

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingSpinner
          message="체크리스트를 불러오고 있어요..."
          centered
          fullScreen
        />
      </PageLayout>
    );
  }

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

  if (!tripId) {
    return (
      <PageLayout>
        <Container maxW="6xl" py={5} px={0}>
          <VStack gap={4} py={8}>
            <Text fontSize="lg" color="gray.600" textAlign="center">
              여행을 선택해주세요
            </Text>
          </VStack>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxW="6xl" py={5} px={0}>
        <VStack gap={4} align="stretch">
          <VStack align="stretch" gap={3}>
            <TripTitle tripId={tripId} initialTitle={initialTripTitle} />

            <HStack justify="flex-end" align="center">
              <HStack gap={2}>
                {/* <IconButton
                aria-label="체크리스트 텍스트로 추출"
                size="sm"
                variant="outline"
                onClick={onCheckListCopyOpen}
              >
                <Download size={16} />
              </IconButton> */}
                <SegmentGroup.Root
                  size="sm"
                  value={viewMode}
                  onValueChange={(details) => {
                    if (details.value) {
                      setViewMode(details.value);
                      localStorage.setItem(
                        STORAGE_KEYS.TRIP_PACK_VIEW_MODE,
                        details.value
                      );
                    }
                  }}
                >
                  <SegmentGroup.Indicator />
                  <SegmentGroup.Items
                    items={[
                      {
                        value: "그리드",
                        label: (
                          <HStack gap={2}>
                            <Grid3X3
                              size={18}
                              color={
                                viewMode === "그리드"
                                  ? "#3182CE"
                                  : "currentColor"
                              }
                            />
                          </HStack>
                        ),
                      },
                      {
                        value: "일렬형식",
                        label: (
                          <HStack gap={2}>
                            <List
                              size={18}
                              color={
                                viewMode === "일렬형식"
                                  ? "#3182CE"
                                  : "currentColor"
                              }
                            />
                          </HStack>
                        ),
                      },
                    ]}
                  />
                </SegmentGroup.Root>
              </HStack>
            </HStack>
          </VStack>

          <ProgressBar progress={progress} />

          {/* 여행지 날씨 정보 */}
          {isShowWeatherCard && (
            <WeatherCard
              cityName={tripInfo.regionName || ""}
              startDate={tripInfo.startDate}
              endDate={tripInfo.endDate}
            />
          )}

          {viewMode === "그리드" ? (
            <GridView categories={categories} />
          ) : (
            <ListView categories={categories} />
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
                카테고리는 최대 15개까지 생성할 수 있습니다. (
                {categories.length}/15)
              </Text>
            </Box>
          )}
        </VStack>
      </Container>

      <FloatingAddButton menuItems={menuItems} ariaLabel="액션 메뉴" />

      <BottomSheet isOpen={isOpen} onClose={onClose} title="새 카테고리 추가">
        <CategoryForm
          onSave={handleSaveCategory}
          onCancel={handleCancelCategoryCreate}
          isLoading={createCategoryMutation.isPending}
        />
      </BottomSheet>

      <BottomSheet
        isOpen={isCheckListCopyOpen}
        onClose={onCheckListCopyClose}
        title=""
      >
        <CheckListCopySheet
          categories={categories}
          onClose={onCheckListCopyClose}
        />
      </BottomSheet>
    </PageLayout>
  );
}
