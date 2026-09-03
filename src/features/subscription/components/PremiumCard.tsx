import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Crown, ChevronRight } from "lucide-react";
import { colors } from "@/shared/constants/colors";

interface PremiumCardProps {
  onClick: () => void;
}

/**
 * 마이페이지 프리미엄 업그레이드 진입점.
 * 테마색(primary) solid 카드로 전환율을 높인다.
 * 이용 중 상태는 프로필 상단 프리미엄 뱃지로 표시하므로 여기서 다루지 않는다.
 */
export default function PremiumCard({ onClick }: PremiumCardProps) {
  return (
    <Box
      as="button"
      w="full"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      bg={colors.primary.solid}
      color={colors.primary.contrast}
      borderRadius="xl"
      px={4}
      py={4}
      boxShadow="md"
      _active={{ opacity: 0.9 }}
    >
      <Box
        position="absolute"
        top={-8}
        right={-6}
        w={28}
        h={28}
        bg="rgba(255,255,255,0.2)"
        borderRadius="full"
        filter="blur(24px)"
      />
      <HStack justify="space-between" w="full" position="relative" zIndex={1}>
        <HStack gap={3}>
          <Box
            bg="rgba(255,255,255,0.2)"
            borderRadius="full"
            p={2}
            display="flex"
          >
            <Crown size={20} strokeWidth={2.2} />
          </Box>
          <VStack align="start" gap={0.5}>
            <Text fontSize="md" fontWeight="bold">
              프리미엄으로 업그레이드
            </Text>
            <Text fontSize="xs" opacity={0.9}>
              여행 관리 무제한 · 한 번 결제로 평생
            </Text>
          </VStack>
        </HStack>
        <Box display="flex">
          <ChevronRight size={20} />
        </Box>
      </HStack>
    </Box>
  );
}
