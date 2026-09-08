import { VStack, HStack, Box, Text, Skeleton } from "@chakra-ui/react";
import { Crown, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import BottomSheet from "@/shared/components/BottomSheet";
import { FREE_TRIP_LIMIT } from "@/shared/constants/app";
import { usePremiumProduct } from "../services/usePremiumProduct";

const BENEFITS = [
  "여행 무제한 생성",
  "저장한 체크리스트 템플릿 무제한",
  "앞으로 추가되는 프리미엄 기능",
];

interface PremiumUpsellSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 한도 도달 시 결제를 유도하는 페이월 바텀시트.
 * 실제 구매 흐름은 /subscribe 한 곳에서만 처리.
 */
export default function PremiumUpsellSheet({
  isOpen,
  onClose,
}: PremiumUpsellSheetProps) {
  const navigate = useNavigate();
  // 시트가 열릴 때만 브릿지에 가격을 요청한다(메인 화면 진입마다 호출하지 않도록).
  const { product, isLoading: isProductLoading } = usePremiumProduct({
    enabled: isOpen,
  });
  const showPrice = product !== null || isProductLoading;

  const handleUpgrade = () => {
    onClose();
    navigate({ to: "/subscribe" });
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="프리미엄으로 업그레이드"
      primaryButton={{ text: "프리미엄 시작하기", onClick: handleUpgrade }}
      secondaryButton={{ text: "다음에", onClick: onClose }}
    >
      <VStack gap={5} align="stretch" px={5} pt={1} pb={4}>
        <VStack gap={3} align="center" textAlign="center">
          <Box
            w="64px"
            h="64px"
            bg="purple.subtle"
            color="purple.solid"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Crown size={30} strokeWidth={2} />
          </Box>
          <VStack gap={1.5}>
            <Text
              fontSize="xl"
              fontWeight="800"
              color="gray.800"
              letterSpacing="-0.5px"
            >
              여행 생성을 무제한으로
            </Text>
            <Text as="p" fontSize="sm" color="gray.500" lineHeight="1.6">
              무료 플랜은 여행 {FREE_TRIP_LIMIT}개까지예요. <br /> 프리미엄은 한
              번만 결제하면 평생 무제한이에요.
            </Text>
          </VStack>
        </VStack>

        <VStack gap={3} align="stretch" bg="gray.50" borderRadius="xl" p={4}>
          {showPrice && (
            <HStack
              justify="space-between"
              align="center"
              pb={3}
              borderBottomWidth="1px"
              borderColor="gray.200"
            >
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.800">
                  프리미엄
                </Text>
                <Text fontSize="xs" color="gray.500">
                  1회 결제 · 평생 이용 · 자동 갱신 없음
                </Text>
              </VStack>
              {product ? (
                <Text
                  fontSize="xl"
                  fontWeight="800"
                  color="gray.900"
                  letterSpacing="-0.5px"
                  flexShrink={0}
                >
                  {product.priceString}
                </Text>
              ) : (
                <Skeleton h="26px" w="76px" borderRadius="md" />
              )}
            </HStack>
          )}
          {BENEFITS.map((benefit) => (
            <HStack key={benefit} gap={3}>
              <Box color="purple.solid" flexShrink={0}>
                <Check size={18} strokeWidth={2.5} />
              </Box>
              <Text fontSize="sm" color="gray.700" fontWeight="medium">
                {benefit}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
