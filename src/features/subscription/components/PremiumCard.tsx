import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Crown, ChevronRight } from "lucide-react";
import { colors } from "@/shared/constants/colors";

interface PremiumCardProps {
  isPremium: boolean;
  onClick: () => void;
}

/**
 * 마이페이지 프리미엄 진입점. 밋밋한 메뉴 행이 아니라 눈에 띄는 카드로 전환율을 높인다.
 * - 미가입: 테마색(primary) solid 카드(업그레이드 유도)
 * - 가입: 테마색(primary) subtle 카드(이용 중 상태)
 */
export default function PremiumCard({ isPremium, onClick }: PremiumCardProps) {
  if (isPremium) {
    return (
      <Box
        as="button"
        w="full"
        onClick={onClick}
        bg={colors.primary.subtle}
        borderWidth="1px"
        borderColor={colors.primary.muted}
        borderRadius="xl"
        px={4}
        py={3.5}
        _active={{ opacity: 0.8 }}
      >
        <HStack justify="space-between" w="full">
          <HStack gap={3}>
            <Box color={colors.primary.solid} display="flex">
              <Crown size={22} strokeWidth={2} />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">
                프리미엄 이용 중
              </Text>
              <Text fontSize="xs" color="gray.500">
                여행을 무제한으로 즐기고 있어요 🎉
              </Text>
            </VStack>
          </HStack>
          <Box color="gray.400" display="flex">
            <ChevronRight size={18} />
          </Box>
        </HStack>
      </Box>
    );
  }

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
              여행 무제한 · 한 번 결제로 평생
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
