import {
  Container,
  VStack,
  Text,
  Box,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

import { FloatingAddButton } from "@/shared/components";

import { packingCreateAtom } from "../create/store/packingCreateAtom";
import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import PackingItemList from "./components/PackingItemList";
import { initializeCategoryAtom } from "../list/store/checklistAtom";
import type { TripTypeOption } from "../create/data/data";

export default function CategoryDetailPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams({
    from: "/packing/category/$categoryName",
  });
  const packingState = useAtomValue(packingCreateAtom);
  const initializeCategory = useSetAtom(initializeCategoryAtom);
  const { onOpen } = useDisclosure();

  // 테스트용 임시 상태 생성
  const testState = {
    ...packingState,
    region: {
      id: "jp-tokyo",
      name: "도쿄",
      country: "일본",
      countryCode: "JP" as const,
      searchKeywords: ["도쿄", "tokyo"],
    },
    dates: { startDate: new Date(), endDate: new Date() },
    companion: "alone" as const,
    companionTypes: [],
    tripTypes: ["관광"] as TripTypeOption[],
  };

  const { handleSetUpCheckList } = useGenerateCheckList(testState);
  const checklistData = handleSetUpCheckList();

  // URL에서 받은 카테고리명으로 해당 카테고리 찾기
  const category = checklistData.find(
    (cat) => cat.categoryName === decodeURIComponent(categoryName)
  );

  useEffect(() => {
    if (category) {
      initializeCategory(category);
    }
  }, [category, initializeCategory]);

  if (!category) {
    return (
      <Container maxW="6xl" py={6}>
        <Text>카테고리를 찾을 수 없습니다.</Text>
      </Container>
    );
  }

  const handleBackClick = () => {
    navigate({ to: "/packing/list" });
  };

  const handleAddItem = () => {
    // TODO: 아이템 추가 로직 구현
    console.log("아이템 추가 버튼 클릭됨");
    onOpen();
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="6xl" py={0} px={0}>
        <VStack gap={0} align="stretch">
          {/* 헤더 */}
          <Box
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            px={4}
            py={4}
            position="sticky"
            top={0}
            zIndex={10}
          >
            <HStack gap={2} align="center">
              <Box as="button" p={1} cursor="pointer" onClick={handleBackClick}>
                <ArrowLeft size={20} />
              </Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {category.categoryName}
              </Text>
            </HStack>
          </Box>

          <Box px={5} py={3}>
            <PackingItemList category={category} />
          </Box>
        </VStack>
      </Container>

      <FloatingAddButton onClick={handleAddItem} ariaLabel="새 아이템 추가" />
    </Box>
  );
}
