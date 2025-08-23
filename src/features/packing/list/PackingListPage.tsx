import { useState } from "react";
import { useAtomValue } from "jotai";
import {
  Container,
  SimpleGrid,
  Text,
  VStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Package, Plus } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { BottomSheet } from "@/shared/components";
import { colors } from "@/shared/constants/colors";

import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import { packingCreateAtom } from "../create/store/packingCreateAtom";
import CategoryBox from "./components/CategoryBox";
import CategoryForm from "./components/CategoryForm";
import type { GeneratedCheckList } from "../create/hooks/useGenerateCheckList";

import { CATEGORY_ICONS } from "./constants/category";

export default function PackingListPage() {
  const packingState = useAtomValue(packingCreateAtom);
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  type CustomCategory = {
    categoryName: string;
    iconKey: string;
    items: unknown[]; // 빈 배열로 초기화
  };

  type CombinedCategory = GeneratedCheckList | CustomCategory;

  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(
    []
  );

  // 테스트용 임시 상태 생성a
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

  // 전체 카테고리 리스트 (기본 + 사용자 정의)
  const allCategories: CombinedCategory[] = [
    ...checklistData,
    ...customCategories,
  ];

  // CategoryForm 핸들러들
  const handleSaveCategory = (newCategory: {
    categoryName: string;
    iconKey: string;
  }) => {
    const customCategory: CustomCategory = {
      categoryName: newCategory.categoryName,
      iconKey: newCategory.iconKey,
      items: [], // 빈 배열로 초기화 - 나중에 항목을 추가할 수 있도록
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

      {/* 플로팅 플러스 버튼 */}
      <IconButton
        aria-label="새 항목 추가"
        position="fixed"
        bottom={6}
        right={6}
        size="lg"
        borderRadius="full"
        colorPalette={colors.primary.palette}
        variant="solid"
        shadow="lg"
        _hover={{ transform: "scale(1.1)" }}
        transition="all 0.2s"
        onClick={onOpen}
      >
        <Plus color="white" />
      </IconButton>

      {/* 카테고리 추가 바텀시트 */}
      <BottomSheet isOpen={isOpen} onClose={onClose} title="새 카테고리 추가">
        <CategoryForm
          onSave={handleSaveCategory}
          onCancel={handleCancelCategory}
        />
      </BottomSheet>
    </PageLayout>
  );
}
