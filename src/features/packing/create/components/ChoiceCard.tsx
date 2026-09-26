import { chakra, Text } from "@chakra-ui/react";

import { colors, componentColors } from "@/shared/constants/colors";

interface ChoiceCardProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ChoiceCard({
  label,
  isSelected,
  onSelect,
}: ChoiceCardProps) {
  return (
    <chakra.button
      type="button"
      flex={1}
      minH="56px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={3}
      px={3.5}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={
        isSelected
          ? colors.primary.solid
          : componentColors.button.border.default
      }
      bg={isSelected ? colors.primary.solid : "bg"}
      transition="all 0.2s"
      aria-pressed={isSelected}
      onClick={onSelect}
    >
      <Text
        fontSize="md"
        fontWeight="medium"
        color={isSelected ? colors.primary.contrast : "gray.700"}
      >
        {label}
      </Text>
    </chakra.button>
  );
}
