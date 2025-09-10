import { useState } from "react";
import {
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { CATEGORY_ICONS } from "../constants/category";

interface CategoryFormProps {
  onSave: (category: { categoryName: string; iconKey: string }) => void;
  onCancel: () => void;
  initialData?: { categoryName: string; iconKey: string };
  isLoading?: boolean;
}

export default function CategoryForm({
  onSave,
  onCancel,
  initialData,
  isLoading = false,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState(
    initialData?.categoryName || ""
  );
  const [selectedIconKey, setSelectedIconKey] = useState<string>(
    initialData?.iconKey || ""
  );

  const handlAddCategory = () => {
    const name = categoryName.trim();

    if (!name) {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }

    if (name.length > 20) {
      alert("카테고리 이름은 20자 이하로 입력해주세요.");
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

    onSave({
      categoryName: name,
      iconKey: selectedIconKey,
    });
  };

  return (
    <VStack gap={0} w="full" h="full" maxH="80vh">
      <Box flex={1} overflowY="auto" w="full" px={4} pt={2}>
        <VStack gap={6} w="full">
          {/* 카테고리명 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              카테고리명
            </Text>
            <Input
              placeholder="카테고리 이름을 입력하세요 (최대 20자)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              size="lg"
              borderRadius="xl"
              maxLength={20}
            />
          </VStack>

          {/* 아이콘 선택 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              아이콘 선택
            </Text>
            <SimpleGrid columns={4} gap={3} w="full">
              {Object.entries(CATEGORY_ICONS).map(([key, IconComponent]) => {
                const isSelected = selectedIconKey === key;
                return (
                  <Box
                    key={key}
                    p={3}
                    bg={isSelected ? "blue.50" : "gray.50"}
                    border="2px"
                    borderColor={isSelected ? "blue.500" : "gray.200"}
                    borderRadius="xl"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    cursor="pointer"
                    gap={2}
                    onClick={() => setSelectedIconKey(key)}
                  >
                    <IconComponent
                      size={24}
                      color={isSelected ? "#3182ce" : "#718096"}
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Box>

      {/* 저장/취소 버튼*/}
      <Box
        w="full"
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        p={4}
        mt={2}
        bg="white"
        borderTop="1px"
        borderColor="gray.100"
      >
        <HStack gap={3}>
          <Button
            flex={1}
            variant="outline"
            size="lg"
            borderRadius="xl"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            flex={1}
            colorPalette={colors.primary.palette}
            variant="solid"
            size="lg"
            borderRadius="xl"
            onClick={handlAddCategory}
            loading={isLoading}
          >
            저장
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
