import { HStack, Box, Text, Flex } from "@chakra-ui/react";
import { ShoppingCart, ChevronRight } from "lucide-react";

import { colors, customPalette, hexColors } from "@/shared/constants/colors";
import type { CoupangDeal } from "@/shared/data/coupangDeals";

interface CoupangCollectRowProps {
  /** 추천할 (랜덤으로 뽑힌) 이 카테고리의 안 챙긴 꿀템 */
  deal: CoupangDeal;
  onClick: () => void;
}

/**
 * 아이템 목록 하단에 표시되는 준비물 추천 행.
 * 일반 물품 카드(PackingItem)와 동일한 흰색 카드 틀이라 리스트에 자연스럽게 섞인다.
 * 그 카테고리의 안 챙긴 꿀템 하나를 언급 → 누르면 모아보기 시트로 연결.
 */
export default function CoupangCollectRow({
  deal,
  onClick,
}: CoupangCollectRowProps) {
  return (
    <Box
      as="button"
      onClick={onClick}
      w="full"
      p={3}
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      shadow="xs"
      textAlign="left"
      transition="all 0.15s"
    >
      <HStack gap={2}>
        <Flex
          w="6"
          h="6"
          borderRadius="md"
          bg="teal.50"
          align="center"
          justify="center"
          flex="none"
        >
          <ShoppingCart size={14} color={hexColors.teal[500]} />
        </Flex>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={colors.primary.fg}
          flex={1}
          lineClamp={1}
        >
          {deal.itemName}, 필요하지 않으세요?
        </Text>
        <Box
          flex="none"
          px={1.5}
          py={0.5}
          borderRadius="full"
          bg={customPalette.rose[100]}
        >
          <Text fontSize="10px" fontWeight="bold" color={customPalette.rose[600]}>
            쿠팡
          </Text>
        </Box>
        <ChevronRight
          size={16}
          color={hexColors.gray[400]}
          style={{ flexShrink: 0 }}
        />
      </HStack>
    </Box>
  );
}
