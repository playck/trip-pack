import { useRef, useEffect } from "react";
import { VStack, Input, Text, Box, SimpleGrid } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { CATEGORY_ICONS } from "../constants/category";

interface CategoryFormProps {
  categoryName: string;
  selectedIconKey: string;
  autoFocus?: boolean;
  onCategoryNameChange: (value: string) => void;
  onIconKeyChange: (key: string) => void;
}

export default function CategoryForm({
  categoryName,
  selectedIconKey,
  autoFocus = false,
  onCategoryNameChange,
  onIconKeyChange,
}: CategoryFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <VStack gap={0} w="full" h="full">
      <Box flex={1} w="full" px={4}>
        <VStack gap={6} w="full">
          {/* 카테고리명 입력 */}
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              카테고리명
            </Text>
            <Input
              ref={inputRef}
              placeholder="카테고리 이름을 입력하세요 (최대 20자)"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
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
                    bg={isSelected ? `${colors.primary.palette}.50` : "gray.50"}
                    border="2px"
                    borderColor={
                      isSelected ? `${colors.primary.palette}.500` : "gray.200"
                    }
                    borderRadius="xl"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    cursor="pointer"
                    gap={2}
                    onClick={() => onIconKeyChange(key)}
                  >
                    <IconComponent
                      size={24}
                      color={
                        isSelected
                          ? colors.primary.hex[500]
                          : colors.neutral.hex[500]
                      }
                    />
                  </Box>
                );
              })}
            </SimpleGrid>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}
