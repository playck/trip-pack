import type { ReactNode } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

interface InfoProps extends BoxProps {
  children: ReactNode;
  colorScheme?: "blue" | "gray" | "green" | "orange";
}

const COLOR_MAP = {
  blue: { bg: "blue.50", border: "blue.100" },
  gray: { bg: "gray.50", border: "gray.100" },
  green: { bg: "green.50", border: "green.100" },
  orange: { bg: "orange.50", border: "orange.100" },
} as const;

export default function Info({
  children,
  colorScheme = "blue",
  ...rest
}: InfoProps) {
  const colors = COLOR_MAP[colorScheme];

  return (
    <Box
      w="100%"
      px={3}
      py={2.5}
      bg={colors.bg}
      borderWidth="1px"
      borderColor={colors.border}
      borderRadius="lg"
      {...rest}
    >
      {children}
    </Box>
  );
}
