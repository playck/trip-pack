import { Box, HStack, Text } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

interface NoticeCardProps {
  icon: string;
  title: string;
  subText?: string;
  onClick?: () => void;
  variant?: "primary" | "gray";
}

export default function NoticeCard({
  icon,
  title,
  subText,
  onClick,
  variant = "primary",
}: NoticeCardProps) {
  const isPrimary = variant === "primary";
  const bgColor = isPrimary ? colors.primary.subtle : "gray.50";
  const borderColor = isPrimary ? colors.primary.solid : "gray.300";
  const titleColor = isPrimary ? colors.primary.fg : "gray.600";
  const textColor = isPrimary ? colors.primary.fg : "gray.500";

  return (
    <Box
      w="full"
      p={1}
      bg={bgColor}
      borderRadius="xl"
      borderLeft="4px solid"
      borderLeftColor={borderColor}
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
    >
      <HStack justify="space-between" align="center" w="full">
        <HStack gap={1} overflow="hidden" flex={1}>
          <Text fontSize="lg">{icon}</Text>
          <Text fontSize="sm" fontWeight="bold" color={titleColor} truncate>
            {title}
          </Text>
          {subText && (
            <>
              <Text fontSize="sm" color={textColor} opacity={0.7}>
                ·
              </Text>
              <Text
                fontSize="sm"
                color={textColor}
                fontWeight="medium"
                whiteSpace="nowrap"
              >
                {subText}
              </Text>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}
