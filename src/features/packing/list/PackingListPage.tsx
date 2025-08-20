import { Container, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import { packingCreateAtom } from "../create/store/packingCreateAtom";

import CategoryBox from "./components/CategoryBox";

import {
  Plane,
  Smartphone,
  Shirt,
  Droplet,
  Sparkles,
  Pill,
  Package,
  Baby,
  Dog,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export default function PackingListPage() {
  const packingState = useAtomValue(packingCreateAtom);

  // 테스트용 임시 상태 생성a
  const testState = {
    ...packingState,
    region: { id: "jp-tokyo", name: "도쿄", countryCode: "JP" as const },
    dates: { startDate: new Date(), endDate: new Date() },
    companion: "alone" as const,
    companionTypes: [],
    tripTypes: ["관광"] as const,
  };

  const { handleSetUpCheckList } = useGenerateCheckList(testState);
  const checklistData = handleSetUpCheckList();

  return (
    <Container maxW="6xl" py={6} px={0}>
      <VStack gap={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          여행 체크리스트
        </Text>

        <SimpleGrid columns={3} gap={4} w="full">
          {checklistData.map((category) => (
            <CategoryBox
              key={category.categoryName}
              category={category}
              icon={CATEGORY_ICONS[category.categoryName] || Package}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "필수 준비물": Plane,
  전자제품: Smartphone,
  의류: Shirt,
  세면용품: Droplet,
  화장품: Sparkles,
  상비약: Pill,
  기타용품: Package,
  유아용품: Baby,
  반려동물용품: Dog,
  운동: Dumbbell,
  수영: Waves,
  한식: UtensilsCrossed,
};
