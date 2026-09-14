import { chakra, Text } from "@chakra-ui/react";

import { colors, componentColors } from "@/shared/constants/colors";

interface ChoiceCardProps {
  /** 선택지 라벨. 이모지를 포함할 수 있다. */
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const CHOICE_CARD_MIN_H = "56px";

export default function ChoiceCard({
  label,
  isSelected,
  onSelect,
}: ChoiceCardProps) {
  return (
    <chakra.button
      type="button"
      flex={1}
      minH={CHOICE_CARD_MIN_H}
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
