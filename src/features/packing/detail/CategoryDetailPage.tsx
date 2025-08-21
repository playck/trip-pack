import { Container, VStack, Text, Box, HStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ArrowLeft } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { packingCreateAtom } from "../create/store/packingCreateAtom";
import useGenerateCheckList from "../create/hooks/useGenerateCheckList";
import PackingItemList from "./components/PackingItemList";

export default function CategoryDetailPage() {
  const navigate = useNavigate();
  const { categoryName } = useParams({
    from: "/packing/category/$categoryName",
  });
  const packingState = useAtomValue(packingCreateAtom);

  // 테스트용 임시 상태 생성
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

  // URL에서 받은 카테고리명으로 해당 카테고리 찾기
  const category = checklistData.find(
    (cat) => cat.categoryName === decodeURIComponent(categoryName)
  );

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

  return (
    <PageLayout>
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
              <HStack gap={3}>
                <Box
                  as="button"
                  onClick={handleBackClick}
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                >
                  <ArrowLeft size={20} />
                </Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  {category.categoryName}
                </Text>
              </HStack>
            </Box>

            <Box px={3} py={3}>
              <PackingItemList category={category} />
            </Box>
          </VStack>
        </Container>
      </Box>
    </PageLayout>
  );
}
