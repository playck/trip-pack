import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Package } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { BottomSheet, FloatingAddButton } from "@/shared/components";

import CategoryBox from "./components/CategoryBox";
import CategoryForm from "./components/CategoryForm";
import { CATEGORY_ICONS } from "./constants/category";
import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import { packingCreateAtom } from "../create/store/packingCreateAtom";
import type { GeneratedCheckList } from "../create/hooks/useGenerateCheckList";

type CustomCategory = {
  categoryName: string;
  iconKey: string;
  items: unknown[]; // 빈 배열로 초기화
};

type CombinedCategory = GeneratedCheckList | CustomCategory;

export default function PackingListPage() {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const packingState = useAtomValue(packingCreateAtom);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    []
  );

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
      <Container maxW="6xl" py={6} px={0}>
        <VStack gap={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            여행 체크리스트
          </Text>

          <SimpleGrid columns={3} gap={4} w="full">
            {allCategories.map((category) => {
              // 사용자 정의 카테고리인 경우 iconKey 사용, 아니면 categoryName으로 매핑
              const iconKey =
                "iconKey" in category
                  ? category.iconKey
                  : category.categoryName;
              const icon = CATEGORY_ICONS[iconKey] || Package;

              return (
                <CategoryBox
                  key={category.categoryName}
                  category={category}
                  icon={icon}
                />
              );
            })}
          </SimpleGrid>
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
