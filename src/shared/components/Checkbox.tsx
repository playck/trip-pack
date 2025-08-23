import { Box, HStack, Text } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

import { colors } from "@/shared/constants/colors";

interface CheckboxProps {
  isChecked: boolean;
  onChange: () => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  colorScheme?: string;
  disabled?: boolean;
}

const sizeMap = {
  sm: { w: "4", h: "4", iconSize: 10, fontSize: "xs" },
  md: { w: "5", h: "5", iconSize: 12, fontSize: "sm" },
  lg: { w: "6", h: "6", iconSize: 14, fontSize: "md" },
};

export default function Checkbox({
  isChecked,
  onChange,
  label,
  size = "md",
  colorScheme = colors.primary.palette,
  disabled = false,
}: CheckboxProps) {
  const { w, h, iconSize, fontSize } = sizeMap[size];

  return (
    <HStack
      as="button"
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      aria-label={label || "체크박스"}
      tabIndex={disabled ? -1 : 0}
      p={1}
      gap={2}
      opacity={disabled ? 0.5 : 1}
      borderRadius="sm"
      transition="all 0.15s ease"
      cursor={disabled ? "not-allowed" : "pointer"}
      onClick={disabled ? undefined : onChange}
      _focus={{
        outline: "2px solid",
        outlineColor: `${colorScheme}.300`,
        outlineOffset: "1.5px",
      }}
      _active={!disabled ? { transform: "scale(0.98)" } : {}}
    >
      <Box
        w={w}
        h={h}
        display="flex"
        alignItems="center"
        justifyContent="center"
        border="2px"
        borderColor={isChecked ? `${colorScheme}.500` : "gray.400"}
        borderRadius="md"
        bg={isChecked ? `${colorScheme}.500` : "gray.200"}
        transition="all 0.15s ease"
        flexShrink={0}
      >
        <CheckIcon size={iconSize} color="white" strokeWidth={3} />
      </Box>

      {label && (
        <Text
          as="span"
          flex={1}
          fontSize={fontSize}
          fontWeight="medium"
          color="gray.800"
          transition="color 0.15s ease"
          lineHeight="1.2"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {label}
        </Text>
      )}
    </HStack>
  );
}
