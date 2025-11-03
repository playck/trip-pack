import { Box, HStack, Text, Spinner } from "@chakra-ui/react";
import { colors, textColors } from "@/shared/constants/colors";

interface SearchStateMessageProps {
  isLoading: boolean;
  hasResults: boolean;
  hasSearchQuery: boolean;
}

export default function SearchStateMessage({
  isLoading,
  hasResults,
  hasSearchQuery,
}: SearchStateMessageProps) {
  if (isLoading) {
    return (
      <HStack justify="center" py={8}>
        <Spinner size="sm" colorPalette={colors.primary.palette} />
        <Text fontSize="sm" color={textColors.muted}>
          검색 중...
        </Text>
      </HStack>
    );
  }

  const showNoResults = !hasResults && hasSearchQuery;
  if (showNoResults) {
    return (
      <Box py={8} textAlign="center">
        <Text fontSize="sm" color={textColors.muted}>
          검색 결과가 없습니다
        </Text>
      </Box>
    );
  }

  const showEmptyState = !hasResults && !hasSearchQuery;
  if (showEmptyState) {
    return (
      <Box py={8} textAlign="center">
        <Text fontSize="sm" color={textColors.muted}>
          방문할 장소를 검색해보세요!
        </Text>
      </Box>
    );
  }

  return null;
}
