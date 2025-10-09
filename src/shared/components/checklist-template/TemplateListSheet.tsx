import { useState } from "react";
import { VStack, Text, Button, Box } from "@chakra-ui/react";
import { useChecklistTemplate } from "@/features/packing/template/hooks";
import { LoadingSpinner, ErrorMessage } from "@/shared/components";
import { CheckListBottomSheet } from "@/shared/components/checklist-template";
import type { CategoryWithItems } from "@/features/packing/type";

interface TemplateListSheetProps {
  onClose: () => void;
  tripId: string;
}

export default function TemplateListSheet({
  onClose,
  tripId,
}: TemplateListSheetProps) {
  const { data: templates = [], isLoading, error } = useChecklistTemplate();
  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [selectedCheckList, setSelectedCheckList] = useState<{
    title: string;
    categories: CategoryWithItems[];
  } | null>(null);

  const handleSelectTemplate = (
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

  if (templates.length === 0) {
    return (
      <VStack gap={4} align="stretch" p={4}>
        <VStack gap={4} py={8}>
          <Text color="gray.500" textAlign="center">
            저장된 템플릿이 없습니다.
          </Text>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack gap={4} align="stretch" p={4} maxH="600px">
      <Box flex="1" overflowY="auto" pr={2}>
        <VStack gap={2}>
          {templates.map((template) => (
            <Box
              key={template.id}
              w="full"
              bg="gray.50"
              borderRadius="lg"
              p={4}
              borderWidth="3px"
              borderColor="gray.200"
              cursor="pointer"
              onClick={() => {
                handleSelectTemplate(template.title, template.checklist_data);
              }}
            >
              <VStack align="start" gap={1}>
                <Text fontWeight="bold" fontSize="md" lineHeight="1.2">
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

      {selectedCheckList && (
        <CheckListBottomSheet
          isOpen={isCheckListOpen}
          onClose={() => setIsCheckListOpen(false)}
          title={selectedCheckList.title}
          categories={selectedCheckList.categories}
          tripId={tripId}
        />
      )}
    </VStack>
  );
}
