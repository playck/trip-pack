import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { systemColors, statusColors } from "@/shared/constants/colors";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isDestructive?: boolean;
}

export default function MenuItem({
  icon: IconComponent,
  label,
  onClick,
  isDestructive,
}: MenuItemProps) {
  return (
    <Box
      as="button"
      w="full"
      onClick={onClick}
      py={4}
      px={1}
      borderBottomWidth="1px"
      borderColor="gray.200"
      _last={{ borderBottomWidth: 0 }}
      _active={{ opacity: 0.7 }}
    >
      <HStack justify="space-between" w="full">
        <HStack gap={3}>
          <Icon
            as={IconComponent}
            color={isDestructive ? statusColors.error.palette : "gray.500"}
            size="lg"
          />
          <Text
            fontSize="md"
            fontWeight={isDestructive ? "semibold" : "medium"}
            color={isDestructive ? statusColors.error.palette : "gray.700"}
          >
            {label}
          </Text>
        </HStack>
        <ChevronRight size={18} color={systemColors.text.subtle} />
      </HStack>
    </Box>
  );
}
