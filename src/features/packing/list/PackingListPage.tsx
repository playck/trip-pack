import { useState } from "react";
import {
  Container,
  Text,
  VStack,
  HStack,
  SegmentGroup,
  useDisclosure,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { Grid3X3, List } from "lucide-react";
import { useParams } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import { BottomSheet, FloatingAddButton } from "@/shared/components";

import CategoryForm from "./components/CategoryForm";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import type { CustomCategory, CombinedCategory } from "./components/types";
import { useTripChecklist } from "./hooks/useTripChecklist";
import { convertCategoryWithItemsToCheckList } from "./utils/categoryConverter";

export default function PackingListPage() {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    []
  );
  const [viewMode, setViewMode] = useState<string>("그리드");
  const { tripId } = useParams({ from: "/packing/list/$tripId" });
  const { categories, isLoading, error } = useTripChecklist(tripId);

  const checklistData = convertCategoryWithItemsToCheckList(categories);

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

  if (isLoading) {
    return (
      <PageLayout>
        <Container maxW="6xl" py={5} px={0}>
          <VStack gap={4} py={8}>
            <Spinner size="lg" color="blue.500" />
            <Text color="gray.600">체크리스트를 불러오고 있어요...</Text>
          </VStack>
        </Container>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Container maxW="6xl" py={5} px={0}>
          <Box
            p={4}
            bg="red.50"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text color="red.600" fontSize="sm">
              {error}
            </Text>
          </Box>
        </Container>
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
