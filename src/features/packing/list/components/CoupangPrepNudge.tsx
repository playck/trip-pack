import { Box, HStack, Text } from "@chakra-ui/react";
import { ShoppingCart, ChevronRight } from "lucide-react";

import { colors, hexColors } from "@/shared/constants/colors";
import type { CoupangDeal } from "@/shared/data/coupangDeals";

interface CoupangPrepNudgeProps {
  /** 추천할 (랜덤으로 뽑힌) 안 챙긴 꿀템 */
  deal: CoupangDeal;
  onClick: () => void;
}

/**
 * 리스트 하단의 준비물 추천 넛지.
 */
export default function CoupangPrepNudge({
  deal,
  onClick,
}: CoupangPrepNudgeProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="full"
      bg="teal.50"
      border="1px solid"
      borderColor="teal.200"
      borderRadius="lg"
      p={3}
      transition="all 0.15s"
    >
      <HStack justify="space-between" gap={2}>
        <HStack gap={1.5} flex={1} minW={0}>
          <ShoppingCart
            size={15}
            color={hexColors.teal[600]}
            style={{ flexShrink: 0 }}
          />
          <Text
            fontSize="sm"
            fontWeight="bold"
            color={colors.primary.fg}
            textAlign="left"
            lineClamp={1}
          >
            {deal.itemName}, 필요하지 않으세요?
          </Text>
        </HStack>

        <HStack
          flex="none"
          gap={0.5}
          bg="teal.500"
          color="white"
          borderRadius="md"
          px={3}
          py={1.5}
        >
          <Text fontSize="xs" fontWeight="bold">
            확인
          </Text>
          <ChevronRight size={13} style={{ flexShrink: 0 }} />
        </HStack>
      </HStack>
    </Box>
  );
}
