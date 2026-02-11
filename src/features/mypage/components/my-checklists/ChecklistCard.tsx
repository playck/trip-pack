import { Box, HStack, VStack, Text, IconButton } from "@chakra-ui/react";
import { ClipboardList, Trash2 } from "lucide-react";
import type { Tables } from "@/shared/types/database.type";
import { colors, statusColors } from "@/shared/constants/colors";

type ChecklistTemplate = Tables<"checklist_templates">;

interface ChecklistCardProps {
  template: ChecklistTemplate;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChecklistCard({
  template,
  onClick,
  onDelete,
}: ChecklistCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  return (
    <Box
      as="button"
      bg="white"
      borderRadius="xl"
      p={4}
      border="1px solid"
      borderColor="gray.200"
      shadow="xs"
      w="full"
      onClick={() => onClick(template.id)}
    >
      <HStack justify="space-between" align="center">
        <HStack gap={3} flex={1}>
          <Box p={2} bg={colors.primary.subtle} borderRadius="lg" color={colors.primary.fg}>
            <ClipboardList size={20} />
          </Box>
          <VStack align="flex-start" gap={0} flex={1}>
            <Text fontWeight="semibold" color="gray.800" lineClamp={1}>
              {template.title}
            </Text>
            {template.description && (
              <Text fontSize="sm" color="gray.500" lineClamp={1}>
                {template.description}
              </Text>
            )}
          </VStack>
        </HStack>
        <IconButton
          aria-label="체크리스트 삭제"
          variant="ghost"
          size="sm"
          color={statusColors.error.palette}
          onClick={handleDelete}
        >
          <Trash2 size={18} />
        </IconButton>
      </HStack>
    </Box>
  );
}
