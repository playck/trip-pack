import { useState } from "react";
import { Container, Text, VStack, useDisclosure, Box } from "@chakra-ui/react";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import {
  BottomSheet,
  ErrorMessage,
  FloatingAddButton,
  LoadingSpinner,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components/FloatingAddButton";
import WeatherCard from "@/shared/components/weather/weatherCard";
import { TemplateListSheet } from "@/shared/components/checklist-template";
import { STORAGE_KEYS } from "@/shared/constants/stroage";
import { useTripInfo } from "@/shared/hooks/useTripQuery";

import {
  ProgressBar,
  CategoryForm,
  GridView,
  ListView,
  TripTitle,
  ViewModeToggle,
} from "./components";
import { useTripChecklist } from "./hooks/useTripChecklist";
import { useCreateCategory } from "./hooks/useCreateCategory";
import { useSaveAsTemplate } from "../template/hooks/useSaveAsTemplate";

export default function PackingListPage() {
  const navigate = useNavigate();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const {
    open: isCheckListOpen,
    onOpen: onCheckListOpen,
    onClose: onCheckListClose,
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
  const { handleSaveAsTemplate } = useSaveAsTemplate();
  const menuItems: FloatingMenuItem[] = [
    {
      label: "체크리스트 저장",
      onClick: () => handleSaveAsTemplate(tripInfo, categories),
    },
    {
      label: "체크리스트 가져오기",
      onClick: () => {
        onCheckListOpen();
      },
    },
    {
      label: "카테고리 추가",
      onClick: () => {
        onOpen();
      },
    },
  ];

  const isCanAddMoreCategories = categories.length < 20;
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
    navigate({ to: "/main" });
    return null;
  }

  return (
    <PageLayout>
      <Container maxW="6xl" py={5} px={0}>
        <VStack gap={4} align="stretch">
          <VStack align="stretch" gap={3}>
            <TripTitle tripId={tripId} initialTitle={initialTripTitle} />

            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
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
                카테고리는 최대 20개까지 생성할 수 있습니다. (
                {categories.length}/20)
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
        isOpen={isCheckListOpen}
        onClose={onCheckListClose}
        title="체크리스트 모음"
      >
        <TemplateListSheet onClose={onCheckListClose} tripId={tripId} />
      </BottomSheet>
    </PageLayout>
  );
}
