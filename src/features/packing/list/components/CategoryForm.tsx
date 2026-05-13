import { useRef, useEffect } from "react";
import {
  VStack,
  Input,
  Text,
  Box,
  SimpleGrid,
  HStack,
  Switch,
} from "@chakra-ui/react";
import { ClipboardPaste } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import { CATEGORY_ICONS } from "../constants/category";

interface CategoryFormProps {
  categoryName: string;
  selectedIconKey: string;
  autoFocus?: boolean;
  onCategoryNameChange: (value: string) => void;
  onIconKeyChange: (key: string) => void;
  showSharedToggle?: boolean;
  isShared?: boolean;
  onSharedChange?: (value: boolean) => void;
  onTextImport?: () => void;
}

export default function CategoryForm({
  categoryName,
  selectedIconKey,
  autoFocus = false,
  onCategoryNameChange,
  onIconKeyChange,
  showSharedToggle = false,
  isShared = false,
  onSharedChange,
  onTextImport,
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
            <HStack w="full" justify="space-between" align="baseline">
              <Text fontSize="md" fontWeight="medium">
                카테고리명
              </Text>
              {onTextImport && (
                <HStack
                  as="button"
                  onClick={onTextImport}
                  gap={1}
                  align="baseline"
                  color="teal.600"
                  cursor="pointer"
                >
                  <ClipboardPaste size={12} />
                  <Text fontSize="xs" fontWeight="medium" lineHeight="1">
                    텍스트로 가져오기
                  </Text>
                </HStack>
              )}
            </HStack>
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
            <Box w="full" maxH="240px" overflowY="auto" pr={1}>
              <SimpleGrid columns={5} gap={2} w="full">
                {Object.entries(CATEGORY_ICONS).map(([key, IconComponent]) => {
                  const isSelected = selectedIconKey === key;
                  return (
                    <Box
                      key={key}
                      p={2.5}
                      bg={
                        isSelected ? `${colors.primary.palette}.50` : "gray.50"
                      }
                      border="2px"
                      borderColor={
                        isSelected
                          ? `${colors.primary.palette}.500`
                          : "gray.200"
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
                        size={22}
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
            </Box>
          </VStack>

          {/* 일행 공유 토글 */}
          {showSharedToggle && (
            <HStack justify="space-between" w="full" py={1} mt={-3}>
              <VStack gap={0.5} align="start">
                <Text fontSize="md" fontWeight="medium">
                  일행과 공유
                </Text>
              </VStack>
              <Switch.Root
                checked={isShared}
                onCheckedChange={(e) => onSharedChange?.(e.checked)}
                colorPalette="teal"
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch.Root>
            </HStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
