import { useState, useCallback } from "react";
import {
  Container,
  Text,
  VStack,
  useDisclosure,
  Box,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Share2 } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import {
  BottomSheet,
  ErrorMessage,
  FloatingAddButton,
} from "@/shared/components";
import type { FloatingMenuItem } from "@/shared/components/FloatingAddButton";
import WeatherCard from "@/shared/components/weather/weatherCard";
import { TemplateListSheet } from "@/shared/components/checklist-template";
import { STORAGE_KEYS } from "@/shared/constants/stroage";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { formatTripDateRange } from "@/shared/utiles/date";
import { TripActionMenu } from "@/shared/components";

import {
  ProgressBar,
  CategoryForm,
  GridView,
  ListView,
  ViewModeToggle,
  CheckListCopySheet,
  ChecklistSaveSheet,
} from "./components";
import {
  useTripChecklist,
  useUpdateItemCheckedStatus,
} from "./hooks/useTripChecklist";
import { useCreateCategory } from "./hooks/useCreateCategory";
import { useSaveAsTemplate } from "../template/hooks/useSaveAsTemplate";

export default function PackingListPage() {
  const navigate = useNavigate();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [categoryName, setCategoryName] = useState("");
  const [selectedIconKey, setSelectedIconKey] = useState<string>("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const [templateName, setTemplateName] = useState("");

  const {
    open: isCheckListOpen,
    onOpen: onCheckListOpen,
    onClose: onCheckListClose,
  } = useDisclosure();
  const {
    open: isShareOpen,
    onOpen: onShareOpen,
    onClose: onShareClose,
  } = useDisclosure();
  const {
    open: isSaveSheetOpen,
    onOpen: onSaveSheetOpen,
    onClose: onSaveSheetClose,
  } = useDisclosure();
  const { tripId } = useParams({ from: "/packing/list/$tripId" });

  const [viewMode, setViewMode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TRIP_PACK_VIEW_MODE) || "그리드";
  });
  const { categories, error, progress } = useTripChecklist(tripId);
  const { data: tripInfo } = useTripInfo(tripId);
  const updateItemStatus = useUpdateItemCheckedStatus(tripId);
  const createCategoryMutation = useCreateCategory(tripId, {
    onSuccess: () => {
      onClose();
      setCategoryName("");
      setSelectedIconKey("");
    },
  });
  const {
    handleSaveAsTemplate,
    isLoading: isSavingTemplate,
    isSuccess: isSaveTemplateSuccess,
  } = useSaveAsTemplate();

  if (isSaveTemplateSuccess && isSaveSheetOpen) {
    onSaveSheetClose();
  }

  const menuItems: FloatingMenuItem[] = [
    {
      label: "체크리스트 저장",
      onClick: () => onSaveSheetOpen(),
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

  const handleSaveCategory = () => {
    const name = categoryName.trim();

    if (!name) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }

    if (name.length > 15) {
      alert("카테고리 이름은 15자 이하로 입력해주세요.");
      return;
    }

    const validNameRegex = /^[가-힣a-zA-Z0-9\s\-_]+$/;
    if (!validNameRegex.test(name)) {
      alert(
        "카테고리 이름에는 한글, 영문, 숫자, 공백, -, _ 만 사용할 수 있습니다."
      );
      return;
    }

    if (!selectedIconKey) {
      alert("아이콘을 선택해주세요.");
      return;
    }

    createCategoryMutation.mutate({
      categoryName: name,
      iconKey: selectedIconKey,
    });
  };

  const handleCancelCategoryCreate = () => {
    onClose();
    setCategoryName("");
    setSelectedIconKey("");
  };

  const handleToggleItem = (itemId: string, isChecked: boolean) => {
    updateItemStatus.mutate({ itemId, isChecked });
  };

  const handleSaveSelectedCategories = () => {
    const selectedCategories = categories.filter((c) =>
      selectedCategoryIds.has(c.id)
    );
    const trimmedName = templateName.trim();

    handleSaveAsTemplate(
      tripInfo,
      selectedCategories,
      trimmedName || undefined
    );
  };

  const handleTemplateNameChange = useCallback((name: string) => {
    setTemplateName(name);
  }, []);

  const handleSelectedCategoryIdsChange = useCallback((ids: Set<string>) => {
    setSelectedCategoryIds(ids);
  }, []);

  const defaultTemplateName = tripInfo?.title
    ? `${tripInfo.title} 체크리스트`
    : "체크리스트";

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
    navigate({ to: "/main" });
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
                aria-label="공유하기"
                variant="ghost"
                size="sm"
                color="gray.600"
                onClick={onShareOpen}
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
          <VStack gap={3} align="stretch">
            <VStack align="stretch" gap={3}>
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
              <ListView
                categories={categories}
                onToggleItem={handleToggleItem}
                countryCode={tripInfo.countryCode}
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
          </VStack>
        </Container>

        <FloatingAddButton menuItems={menuItems} ariaLabel="액션 메뉴" />

        <BottomSheet
          isOpen={isOpen}
          onClose={handleCancelCategoryCreate}
          title="새 카테고리 추가"
          primaryButton={{
            text: "저장",
            onClick: handleSaveCategory,
            isLoading: createCategoryMutation.isPending,
          }}
          secondaryButton={{
            text: "취소",
            onClick: handleCancelCategoryCreate,
          }}
        >
          <CategoryForm
            categoryName={categoryName}
            selectedIconKey={selectedIconKey}
            onCategoryNameChange={setCategoryName}
            onIconKeyChange={setSelectedIconKey}
          />
        </BottomSheet>

        <BottomSheet
          isOpen={isCheckListOpen}
          onClose={onCheckListClose}
          title="체크리스트 모음"
          secondaryButton={{
            text: "닫기",
            onClick: onCheckListClose,
          }}
        >
          <TemplateListSheet onClose={onCheckListClose} tripId={tripId} />
        </BottomSheet>

        <BottomSheet isOpen={isShareOpen} onClose={onShareClose}>
          <CheckListCopySheet categories={categories} onClose={onShareClose} />
        </BottomSheet>

        <BottomSheet
          isOpen={isSaveSheetOpen}
          onClose={onSaveSheetClose}
          title="체크리스트 템플릿 저장"
          primaryButton={{
            text: "저장",
            onClick: handleSaveSelectedCategories,
            isLoading: isSavingTemplate,
            disabled: selectedCategoryIds.size === 0 || !templateName.trim(),
          }}
          secondaryButton={{
            text: "취소",
            onClick: onSaveSheetClose,
            disabled: isSavingTemplate,
          }}
        >
          <ChecklistSaveSheet
            categories={categories}
            defaultTemplateName={defaultTemplateName}
            onSelectedChange={handleSelectedCategoryIdsChange}
            onTemplateNameChange={handleTemplateNameChange}
          />
        </BottomSheet>
      </PageLayout>
    </>
  );
}
