import { useState } from "react";
import { VStack, Text, Button, Box } from "@chakra-ui/react";
import { useChecklistTemplate } from "@/features/packing/template/hooks";
import { LoadingSpinner, ErrorMessage } from "@/shared/components";
import { CheckListBottomSheet } from "@/shared/components/checklist-template";
import { colors } from "@/shared/constants/colors";
import type { CategoryWithItems } from "@/features/packing/type";

interface TemplateListSheetProps {
  onClose: () => void;
}

export default function TemplateListSheet({ onClose }: TemplateListSheetProps) {
  const { data: templates = [], isLoading, error } = useChecklistTemplate();
  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [selectedCheckList, setSelectedCheckList] = useState<{
    title: string;
    categories: CategoryWithItems[];
  } | null>(null);

  const handleSelectTemplate = (
    templateId: string,
    templateTitle: string,
    checklistData: unknown
  ) => {
    setSelectedCheckList({
      title: templateTitle,
      categories: checklistData as CategoryWithItems[],
    });
    setIsCheckListOpen(true);
  };

  if (isLoading) {
    return (
      <VStack gap={4} align="stretch" p={4} minH="300px" justify="center">
        <LoadingSpinner message="템플릿을 불러오는 중..." />
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack gap={4} align="stretch" p={4}>
        <ErrorMessage
          message={error?.message || "템플릿을 불러올 수 없습니다"}
          title="오류 발생"
        />
        <Button onClick={onClose}>닫기</Button>
      </VStack>
    );
  }

  return (
    <VStack gap={4} align="stretch" p={4} maxH="600px">
      {templates.length === 0 ? (
        <VStack gap={4} py={8}>
          <Text color="gray.500" textAlign="center">
            저장된 템플릿이 없습니다.
          </Text>
          <Button onClick={onClose}>닫기</Button>
        </VStack>
      ) : (
        <>
          <Box flex="1" overflowY="auto" pr={2}>
            <VStack gap={3}>
              {templates.map((template) => (
                <Box
                  key={template.id}
                  w="full"
                  bg={colors.primary.subtle}
                  borderRadius="lg"
                  p={4}
                  cursor="pointer"
                  borderWidth="8px"
                  borderColor={colors.primary.muted}
                  onClick={() => {
                    handleSelectTemplate(
                      template.id,
                      template.title,
                      template.checklist_data
                    );
                  }}
                >
                  <VStack align="start" gap={1}>
                    <Text
                      fontWeight="bold"
                      fontSize="md"
                      color="gray.800"
                      lineHeight="1.2"
                    >
                      {template.title}
                    </Text>
                    {template.description && (
                      <Text
                        color="gray.600"
                        fontSize="sm"
                        lineClamp={2}
                        lineHeight="1.5"
                      >
                        {template.description}
                      </Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>

          <Button variant="outline" onClick={onClose} flexShrink={0}>
            닫기
          </Button>
        </>
      )}

      {selectedCheckList && (
        <CheckListBottomSheet
          isOpen={isCheckListOpen}
          onClose={() => setIsCheckListOpen(false)}
          title={selectedCheckList.title}
          categories={selectedCheckList.categories}
        />
      )}
    </VStack>
  );
}
