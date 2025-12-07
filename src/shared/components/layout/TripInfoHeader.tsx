import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

interface TripInfoHeaderProps {
  title: string;
  subTitle?: string;
  rightAction?: React.ReactNode;
}

export default function TripInfoHeader({
  title,
  subTitle,
  rightAction,
}: TripInfoHeaderProps) {
  return (
    <Box
      as="header"
      w="full"
      h={`${TRIP_INFO_HEADER_HEIGHT}px`}
      bg="white"
      position="sticky"
      top={`${HEADER_HEIGHT}px`}
      zIndex={99}
    >
      <Flex align="center" justify="space-between" h="full" gap={2}>
        <HStack gap={2} flex={1} overflow="hidden" align="baseline">
          <Text
            fontSize="md"
            fontWeight="bold"
            color="gray.900"
            lineHeight="1.2"
            truncate
          >
            {title}
          </Text>
          {subTitle && (
            <Text fontSize="xs" color="gray.500" flexShrink="0" truncate>
              {subTitle}
            </Text>
          )}
        </HStack>

        {/* 우측 */}
        <Flex minW="32px" justify="flex-end" align="center">
          {rightAction}
        </Flex>
      </Flex>
    </Box>
  );
}
