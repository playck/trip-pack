import { HStack, VStack, Text, Flex, Image } from "@chakra-ui/react";
import { ShoppingCart, ChevronRight } from "lucide-react";

import { BottomSheet } from "@/shared/components";
import { customPalette, hexColors } from "@/shared/constants/colors";
import { openExternalUrl, triggerHaptic } from "@/shared/utils/nativeMessage";
import type { CoupangDeal } from "@/shared/data/coupangDeals";

interface CoupangShoppingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 안 챙긴(미체크) 꿀템 목록 */
  deals: CoupangDeal[];
}

/**
 * "준비물 쇼핑" 모아보기 시트.
 */
export default function CoupangShoppingSheet({
  isOpen,
  onClose,
  deals,
}: CoupangShoppingSheetProps) {
  const handleBuy = (deal: CoupangDeal) => {
    triggerHaptic("light");
    openExternalUrl(deal.url);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="이런 거 필요하지 않으세요?"
    >
      <VStack px={4} pb={4} gap={2.5} align="stretch">
        <Text fontSize="xs" color="gray.500" px={1} textAlign="right">
          아이템을 누르면 쿠팡으로 연결됩니다
        </Text>
        {deals.map((deal) => (
          <HStack
            key={deal.itemName}
            as="button"
            aria-label={`${deal.itemName} 쿠팡에서 보기`}
            onClick={() => handleBuy(deal)}
            w="full"
            p={2.5}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            gap={3}
            textAlign="left"
          >
            {deal.imageUrl ? (
              <Image
                src={deal.imageUrl}
                alt={deal.productName ?? deal.itemName}
                w="12"
                h="12"
                borderRadius="lg"
                objectFit="cover"
                flex="none"
              />
            ) : (
              <Flex
                w="12"
                h="12"
                borderRadius="lg"
                bg="gray.100"
                align="center"
                justify="center"
                flex="none"
              >
                <ShoppingCart size={18} color={hexColors.gray[400]} />
              </Flex>
            )}

            <VStack gap={0.5} align="start" flex={1} minW={0}>
              <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                {deal.productName ?? deal.itemName}
              </Text>
              {deal.price !== undefined && (
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={customPalette.rose[600]}
                >
                  {deal.price.toLocaleString("ko-KR")}원
                </Text>
              )}
            </VStack>

            <ChevronRight
              size={16}
              color={hexColors.gray[400]}
              style={{ flexShrink: 0 }}
            />
          </HStack>
        ))}

        <Text fontSize="11px" color="gray.400" textAlign="center" pt={2} pb={1}>
          쿠팡 파트너스 활동의 일환으로 일정 수수료를 받습니다.
        </Text>
      </VStack>
    </BottomSheet>
  );
}
