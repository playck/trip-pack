import { Box, VStack, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORY_ICONS } from "@/features/packing/list/constants/category";
import { backgrounds, colors, textColors } from "@/shared/constants/colors";

interface SelectableCategoryBoxProps {
  name: string;
  iconKey?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  subText?: string;
  onClick?: () => void;
}

export default function SelectableCategoryBox({
  name,
  iconKey,
  isSelected = false,
  isDisabled = false,
  subText,
  onClick,
}: SelectableCategoryBoxProps) {
  const IconComponent: LucideIcon = iconKey
    ? CATEGORY_ICONS[iconKey] || Package
    : CATEGORY_ICONS[name] || Package;

  return (
    <Box
      p={3}
      bg={isDisabled ? "gray.100" : backgrounds.muted}
      borderRadius="xl"
      border="3px solid"
      borderColor={
        isDisabled
          ? "transparent"
          : isSelected
            ? `${colors.primary.palette}.500`
            : "transparent"
      }
      transition="border-color 0.2s"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      opacity={isDisabled ? 0.5 : 1}
      onClick={isDisabled ? undefined : onClick}
    >
      <VStack gap={2} w="full">
        <Box
          w="12"
          h="12"
          bg={isDisabled ? "gray.200" : backgrounds.primary}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={isDisabled ? "gray.400" : `${colors.primary.palette}.500`}
        >
          <IconComponent size={28} />
        </Box>
        <VStack gap={0}>
          <Text
            fontSize="sm"
            fontWeight="medium"
            textAlign="center"
            color={isDisabled ? "gray.400" : textColors.secondary}
          >
            {name}
          </Text>
          {subText && (
            <Text fontSize="xs" color="gray.400">
              {subText}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
