import { useState } from "react";
import { VStack, Text, Button, Box, Skeleton } from "@chakra-ui/react";
import { useChecklistTemplate } from "@/features/packing/template/hooks";
import { BottomSheet, ErrorMessage } from "@/shared/components";
import type { TemplateCategoryWithItems } from "@/features/packing/type";
import CheckListBottomSheet from "./CheckListBottomSheet";
import type { CategoryWithType } from "./CheckListBottomSheet";

interface TemplateListSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

const convertToCategories = (
  templateCategories: TemplateCategoryWithItems[],
): CategoryWithType[] =>
  templateCategories
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((tc) => ({
      id: tc.id,
      name: tc.name,
      icon_key: tc.icon_key,
      display_order: tc.display_order,
      created_at: tc.created_at,
      trip_id: null,
      category_type: tc.category_type,
      items: tc.template_items
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((ti) => ({
          id: ti.id,
          name: ti.name,
          notes: ti.notes,
          is_required: ti.is_required,
          display_order: ti.display_order,
          category_id: tc.id,
          is_checked: false,
          cabin_notes: null,
          cabin_policy: null,
          created_at: ti.created_at,
          updated_at: null,
        })),
    }));

export default function TemplateListSheet({
  isOpen,
  onClose,
  tripId,
}: TemplateListSheetProps) {
  const { data: templates = [], isLoading, error } = useChecklistTemplate();
  const [isCheckListOpen, setIsCheckListOpen] = useState(false);
  const [selectedCheckList, setSelectedCheckList] = useState<{
    title: string;
    categories: CategoryWithType[];
  } | null>(null);

  const handleSelectTemplate = (
    templateTitle: string,
    templateCategories: TemplateCategoryWithItems[]
  ) => {
    setSelectedCheckList({
      title: templateTitle,
      categories: convertToCategories(templateCategories),
    });
    setIsCheckListOpen(true);
  };

  if (isLoading) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="체크리스트 모음"
        expanded
        secondaryButton={{ text: "닫기", onClick: onClose }}
      >
        <VStack gap={4} align="stretch" p={4} maxH="600px">
          <Box flex="1" overflowY="auto" pr={0}>
            <Box
              w="full"
              bg="gray.50"
              borderRadius="lg"
              p={4}
              borderWidth="3px"
              borderColor="gray.200"
            >
              <VStack align="start" gap={1}>
                <Skeleton height="20px" width="50%" />
                <Skeleton height="16px" width="80%" />
              </VStack>
            </Box>
          </Box>
          <Skeleton height="40px" width="100%" borderRadius="md" />
        </VStack>
      </BottomSheet>
    );
  }

  if (error) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="체크리스트 모음"
        expanded
        secondaryButton={{ text: "닫기", onClick: onClose }}
      >
        <VStack gap={4} align="stretch" p={4}>
          <ErrorMessage
            message={error?.message || "템플릿을 불러올 수 없습니다"}
            title="오류 발생"
          />
          <Button onClick={onClose}>닫기</Button>
        </VStack>
      </BottomSheet>
    );
  }

  if (templates.length === 0) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="체크리스트 모음"
        expanded
        secondaryButton={{ text: "닫기", onClick: onClose }}
      >
        <VStack gap={4} align="stretch" p={4}>
          <VStack gap={4} py={8}>
            <Text color="gray.500" textAlign="center">
              저장된 템플릿이 없습니다.
            </Text>
          </VStack>
        </VStack>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="체크리스트 모음"
      expanded
      secondaryButton={{
        text: "닫기",
        onClick: onClose,
      }}
    >
      <VStack gap={4} align="stretch" px={4} maxH="600px">
        <Box flex="1" overflowY="auto" pr={0}>
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
                  handleSelectTemplate(
                    template.title,
                    template.template_categories ?? []
                  );
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

        {selectedCheckList && (
          <CheckListBottomSheet
            isOpen={isCheckListOpen}
            onClose={() => setIsCheckListOpen(false)}
            onSuccess={onClose}
            title={selectedCheckList.title}
            categories={selectedCheckList.categories}
            tripId={tripId}
          />
        )}
      </VStack>
    </BottomSheet>
  );
}
