import {
  Container,
  VStack,
  Text,
  Box,
  HStack,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { BottomSheet, FloatingAddButton } from "@/shared/components";

import PackingItemList from "./components/PackingItemList";
import { ItemForm } from "./components";
import { useTripChecklist } from "../list/hooks/useTripChecklist";
import type { CategoryWithItems } from "../type";

export default function CategoryDetailPage() {
  const navigate = useNavigate();
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const { tripId } = useParams({
    from: "/packing/category/$tripId",
  });
  const search = useSearch({
    from: "/packing/category/$tripId",
  });
  const categoryName = (search as { category?: string }).category || "";
  const { categories, isLoading, error } = useTripChecklist(tripId || "");

  const decodedCategoryName = decodeURIComponent(categoryName);
  const category = categories?.find(
    (cat: CategoryWithItems) => cat.name === decodedCategoryName
  );

  if (isLoading) {
    return (
      <Container maxW="6xl" py={6}>
        <VStack gap={4} py={8}>
          <Spinner size="lg" color="blue.500" />
          <Text color="gray.600">체크리스트를 불러오고 있어요...</Text>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="6xl" py={6}>
        <Box
          p={4}
          bg="red.50"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="red.200"
        >
          <Text color="red.600" fontSize="sm">
            체크리스트를 불러오는 중 오류가 발생했습니다: {error}
          </Text>
        </Box>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container maxW="6xl" py={6}>
        <Text>카테고리를 찾을 수 없습니다.</Text>
      </Container>
    );
  }

  const handleBackClick = () => {
    navigate({
      to: "/packing/list/$tripId",
      params: { tripId },
    });
  };

  const handleAddItem = () => {
    onOpen();
  };

  const handleSaveItem = (newItem: { name: string; notes?: string }) => {
    // TODO: DB에 새 아이템 추가 API 호출
    console.log("새 아이템 추가:", newItem);
    onClose();
  };

  const handleCancelItem = () => {
    onClose();
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
            py={2}
            position="sticky"
            top={0}
            zIndex={10}
          >
            <HStack gap={2} align="center">
              <Box as="button" p={1} cursor="pointer" onClick={handleBackClick}>
                <ArrowLeft size={20} />
              </Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {category.name}
              </Text>
            </HStack>
          </Box>

          <Box px={5} py={3}>
            <PackingItemList category={category} tripId={tripId} />
          </Box>
        </VStack>
      </Container>

      <FloatingAddButton onClick={handleAddItem} ariaLabel="새 아이템 추가" />

      <BottomSheet isOpen={isOpen} onClose={onClose} title="새 아이템 추가">
        <ItemForm onSave={handleSaveItem} onCancel={handleCancelItem} />
      </BottomSheet>
    </Box>
  );
}
