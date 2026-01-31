import { useState, useMemo } from "react";
import {
  VStack,
  Box,
  Text,
  HStack,
  Spinner,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronRight, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BottomSheet, Checkbox } from "@/shared/components";
import { useChecklistTemplates } from "@/features/packing/template/services";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import { backgrounds, colors, textColors } from "@/shared/constants/colors";
import type { CategoryWithItems } from "@/features/packing/type";

interface TemplateImportSheetProps {
  isOpen: boolean;
  currentTemplateId: string;
  existingCategoryNames: string[];
  onImport: (categories: CategoryWithItems[]) => void;
  onClose: () => void;
}

type Step = "select-template" | "select-categories";

export default function TemplateImportSheet({
  isOpen,
  currentTemplateId,
  existingCategoryNames,
  onImport,
  onClose,
}: TemplateImportSheetProps) {
  const { data: templates, isLoading } = useChecklistTemplates();
  const [step, setStep] = useState<Step>("select-template");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );

  // 현재 템플릿 제외한 목록
  const availableTemplates = useMemo(() => {
    return templates?.filter((t) => t.id !== currentTemplateId) || [];
  }, [templates, currentTemplateId]);

  const selectedTemplateCategories = useMemo(() => {
    if (!selectedTemplateId) return [];
    const template = templates?.find((t) => t.id === selectedTemplateId);
    if (!template?.checklist_data) return [];
    return template.checklist_data as unknown as CategoryWithItems[];
  }, [templates, selectedTemplateId]);

  const existingNamesSet = useMemo(() => {
    return new Set(existingCategoryNames.map((name) => name.toLowerCase()));
  }, [existingCategoryNames]);

  const isCategoryDuplicate = (categoryName: string) => {
    return existingNamesSet.has(categoryName.toLowerCase());
  };

  // 선택 가능한 카테고리 (중복 제외)
  const selectableCategories = useMemo(() => {
    return selectedTemplateCategories.filter(
      (c) => !existingNamesSet.has(c.name.toLowerCase()),
    );
  }, [selectedTemplateCategories, existingNamesSet]);

  const duplicateCount =
    selectedTemplateCategories.length - selectableCategories.length;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSelectedCategoryIds(new Set());
    setStep("select-categories");
  };

  const handleCategoryToggle = (categoryId: string) => {
    const category = selectedTemplateCategories.find(
      (c) => c.id === categoryId,
    );
    if (category && isCategoryDuplicate(category.name)) return;

    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    // 선택 가능한 카테고리만 대상
    if (selectedCategoryIds.size === selectableCategories.length) {
      setSelectedCategoryIds(new Set());
    } else {
      setSelectedCategoryIds(new Set(selectableCategories.map((c) => c.id)));
    }
  };

  const resetState = () => {
    setStep("select-template");
    setSelectedTemplateId(null);
    setSelectedCategoryIds(new Set());
  };

  const handleImport = () => {
    const categoriesToImport = selectedTemplateCategories.filter((c) =>
      selectedCategoryIds.has(c.id),
    );
    onImport(categoriesToImport);
    handleClose();
  };

  const handleBack = () => {
    resetState();
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const isAllSelected =
    selectedCategoryIds.size === selectableCategories.length &&
    selectableCategories.length > 0;

  if (step === "select-template") {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="체크리스트 가져오기"
      >
        <VStack gap={0} align="stretch" maxH="60vh" overflowY="auto">
          {isLoading ? (
            <Center py={8}>
              <Spinner color={colors.primary.palette} />
            </Center>
          ) : availableTemplates.length === 0 ? (
            <Center py={8}>
              <Text color="gray.500" fontSize="sm">
                가져올 수 있는 체크리스트가 없습니다.
              </Text>
            </Center>
          ) : (
            availableTemplates.map((template, index) => {
              return (
                <Box
                  key={template.id}
                  as="button"
                  px={4}
                  py={3}
                  borderTop={index > 0 ? "1px solid" : "none"}
                  borderColor="gray.300"
                  textAlign="left"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="medium" color="gray.800">
                      {template.title}
                    </Text>

                    <ChevronRight size={20} color="#A0AEC0" />
                  </HStack>
                </Box>
              );
            })
          )}
        </VStack>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="카테고리 선택"
      onBack={handleBack}
      primaryButton={{
        text: `${selectedCategoryIds.size}개 가져오기`,
        onClick: handleImport,
        disabled: selectedCategoryIds.size === 0,
      }}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
    >
      <VStack gap={3} align="stretch" p={3}>
        {/* 안내 텍스트 */}
        {duplicateCount > 0 && (
          <Box px={2} py={2} bg="orange.50" borderRadius="md">
            <Text fontSize="xs" color="orange.600">
              이미 동일한 이름의 카테고리가 {duplicateCount}개 있어 선택할 수
              없습니다.
            </Text>
          </Box>
        )}

        <HStack justify="space-between" align="center" px={1}>
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            가져올 카테고리 선택 ({selectedCategoryIds.size}/
            {selectableCategories.length})
          </Text>
          {selectableCategories.length > 0 && (
            <Checkbox
              isChecked={isAllSelected}
              onChange={handleSelectAll}
              label="전체 선택"
              colorScheme={colors.primary.palette}
            />
          )}
        </HStack>

        {/* 카테고리 리스트 */}
        <Box maxH="50vh" overflowY="auto" pr={1}>
          <SimpleGrid columns={3} gap={4} w="full">
            {selectedTemplateCategories.map((category) => {
              const IconComponent = (
                category.icon_key
                  ? CATEGORY_ICONS[category.icon_key] || Package
                  : CATEGORY_ICONS[category.name] || Package
              ) as LucideIcon;
              const isSelected = selectedCategoryIds.has(category.id);
              const isDuplicate = isCategoryDuplicate(category.name);

              return (
                <Box
                  key={category.id}
                  p={3}
                  bg={isDuplicate ? "gray.100" : backgrounds.muted}
                  borderRadius="xl"
                  border="3px solid"
                  borderColor={
                    isDuplicate
                      ? "transparent"
                      : isSelected
                        ? `${colors.primary.palette}.500`
                        : "transparent"
                  }
                  transition="border-color 0.2s"
                  cursor={isDuplicate ? "not-allowed" : "pointer"}
                  opacity={isDuplicate ? 0.5 : 1}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <VStack gap={2} w="full">
                    <Box
                      w="12"
                      h="12"
                      bg={isDuplicate ? "gray.200" : backgrounds.primary}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color={
                        isDuplicate
                          ? "gray.400"
                          : `${colors.primary.palette}.500`
                      }
                    >
                      <IconComponent size={28} />
                    </Box>
                    <VStack gap={0}>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        textAlign="center"
                        color={isDuplicate ? "gray.400" : textColors.secondary}
                      >
                        {category.name}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {isDuplicate
                          ? "이미 있음"
                          : `${category.items.length}개`}
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </VStack>
    </BottomSheet>
  );
}
