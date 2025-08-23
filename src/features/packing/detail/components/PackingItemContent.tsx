import { Box, HStack } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";

import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";

interface PackingItemContentProps {
  itemName: string;
  isChecked: boolean;
  onToggleCheck: () => void;
  onOpenActions: () => void;
}

export default function PackingItemContent({
  itemName,
  isChecked,
  onToggleCheck,
  onOpenActions,
}: PackingItemContentProps) {
  return (
    <HStack justify="space-between" align="center">
      <Checkbox
        isChecked={isChecked}
        onChange={onToggleCheck}
        label={itemName}
        size="md"
        colorScheme={colors.primary.palette}
      />

      <Box
        as="button"
        aria-label="옵션 더보기"
        w="8"
        h="8"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.400"
        borderRadius="md"
        cursor="pointer"
        _active={{
          bg: "gray.200",
        }}
        onClick={onOpenActions}
      >
        <MoreVertical size={16} />
      </Box>
    </HStack>
  );
}
