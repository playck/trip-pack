import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  Container,
  Text,
  VStack,
  HStack,
  SegmentGroup,
  useDisclosure,
} from "@chakra-ui/react";
import { Grid3X3, List } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { BottomSheet, FloatingAddButton } from "@/shared/components";

import CategoryForm from "./components/CategoryForm";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import type { CustomCategory, CombinedCategory } from "./components/types";
import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import { packingCreateAtom } from "../create/store/packingCreateAtom";

export default function PackingListPage() {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const packingState = useAtomValue(packingCreateAtom);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    []
  );
  const [viewMode, setViewMode] = useState<string>("그리드");

  const testState = {
    ...packingState,
    region: { id: "jp-tokyo", name: "도쿄", countryCode: "JP" as const },
    dates: { startDate: new Date(), endDate: new Date() },
    companion: "alone" as const,
    companionTypes: [],
    tripTypes: ["관광"] as const,
  };

  const { handleSetUpCheckList } = useGenerateCheckList(
    testState as unknown as typeof packingState
  );
  const checklistData = handleSetUpCheckList();

  const allCategories: CombinedCategory[] = [
    ...checklistData,
    ...customCategories,
  ];

  const handleSaveCategory = (newCategory: {
    categoryName: string;
    iconKey: string;
  }) => {
    const customCategory: CustomCategory = {
      categoryName: newCategory.categoryName,
      iconKey: newCategory.iconKey,
      items: [],
    };
    setCustomCategories((prev) => [...prev, customCategory]);
    onClose();
  };

  const handleCancelCategory = () => {
    onClose();
  };

  return (
    <PageLayout>
      <Container maxW="6xl" py={5} px={0}>
        <VStack gap={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              여행 체크리스트
            </Text>
            <SegmentGroup.Root
              size="sm"
              value={viewMode}
              onValueChange={(details) => {
                if (details.value) {
                  setViewMode(details.value);
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
                            viewMode === "그리드" ? "#3182CE" : "currentColor"
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
                            viewMode === "일렬형식" ? "#3182CE" : "currentColor"
                          }
                        />
                      </HStack>
                    ),
                  },
                ]}
              />
            </SegmentGroup.Root>
          </HStack>

          {viewMode === "그리드" ? (
            <GridView categories={allCategories} />
          ) : (
            <ListView categories={allCategories} />
          )}
        </VStack>
      </Container>

      <FloatingAddButton onClick={onOpen} ariaLabel="새 카테고리 추가" />

      <BottomSheet isOpen={isOpen} onClose={onClose} title="새 카테고리 추가">
        <CategoryForm
          onSave={handleSaveCategory}
          onCancel={handleCancelCategory}
        />
      </BottomSheet>
    </PageLayout>
  );
}
