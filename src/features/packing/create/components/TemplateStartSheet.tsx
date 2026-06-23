import { useState } from "react";
import { VStack, Text, Box, HStack, Icon } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { BottomSheet } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import type { ChecklistTemplateWithCategories } from "@/features/packing/type";

interface TemplateStartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ChecklistTemplateWithCategories[];
  onSelect: (template: ChecklistTemplateWithCategories) => void;
}

export default function TemplateStartSheet({
  isOpen,
  onClose,
  templates,
  onSelect,
}: TemplateStartSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const handleConfirm = () => {
    const selected = templates.find((template) => template.id === selectedId);
    if (selected) onSelect(selected);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="내 체크리스트로 시작"
      size="max"
      secondaryButton={{ text: "닫기", onClick: handleClose }}
      primaryButton={{
        text: "이 체크리스트로 시작",
        onClick: handleConfirm,
        disabled: !selectedId,
      }}
    >
      <VStack
        gap={2}
        align="stretch"
        pt={6}
        px={4}
        maxH="600px"
        overflowY="auto"
      >
        {templates.map((template) => {
          const isSelected = template.id === selectedId;
          return (
            <Box
              key={template.id}
              w="full"
              bg={isSelected ? colors.primary.subtle : "gray.50"}
              borderRadius="lg"
              p={4}
              borderWidth="3px"
              borderColor={isSelected ? colors.primary.solid : "gray.200"}
              cursor="pointer"
              transition="border-color 0.15s, background-color 0.15s"
              onClick={() => setSelectedId(template.id)}
            >
              <HStack justify="space-between" align="start" gap={3}>
                <VStack align="start" gap={1} flex={1}>
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
                {isSelected && (
                  <Icon
                    as={Check}
                    boxSize={5}
                    color={colors.primary.solid}
                    flexShrink={0}
                  />
                )}
              </HStack>
            </Box>
          );
        })}
      </VStack>
    </BottomSheet>
  );
}
