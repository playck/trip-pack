import { useState, useMemo } from "react";
import { VStack, Box, Text, HStack, Spinner, Center } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { BottomSheet } from "@/shared/components";
import { useChecklistTemplates } from "@/features/packing/template/services";
import { colors, systemColors } from "@/shared/constants/colors";
import type { CategoryWithItems } from "@/features/packing/type";
import ImportCategorySelect from "./ImportCategorySelect";

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

  const handleClose = () => {
    resetState();
    onClose();
  };

  const isAllSelected =
    selectedCategoryIds.size === selectableCategories.length &&
    selectableCategories.length > 0;

  // Step 1: 템플릿 선택
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
            availableTemplates.map((template, index) => (
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
                  <ChevronRight size={20} color={systemColors.text.subtle} />
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      </BottomSheet>
    );
  }

  // Step 2: 카테고리 선택
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="카테고리 선택"
      onBack={resetState}
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
      <ImportCategorySelect
        categories={selectedTemplateCategories}
        selectedIds={selectedCategoryIds}
        selectableCount={selectableCategories.length}
        duplicateCount={duplicateCount}
        isAllSelected={isAllSelected}
        isCategoryDuplicate={isCategoryDuplicate}
        onToggle={handleCategoryToggle}
        onSelectAll={handleSelectAll}
      />
    </BottomSheet>
  );
}
