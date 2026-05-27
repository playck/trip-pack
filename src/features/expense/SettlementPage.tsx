import { useMemo } from "react";
import { useAtom } from "jotai";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Box,
  Text,
  HStack,
  VStack,
  Flex,
  IconButton,
  Button,
} from "@chakra-ui/react";
import {
  ChevronLeft,
  Share2,
  Wallet,
  Users,
  Divide,
  ArrowLeftRight,
  Bookmark,
  Briefcase,
} from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { colors } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";

import { useTripExpenses } from "./services";
import { useTripCurrency } from "./hooks/useTripCurrency";
import { useShareSettlement } from "./hooks/useShareSettlement";
import { showLocalCurrencyAtom } from "./store/currencyStore";
import { formatAmount } from "./utils/helper";

export default function SettlementPage() {
  const { tripId } = useParams({ from: "/expense/settlement/$tripId" });
  const navigate = useNavigate();

  const { user } = useAuth();
  const { data: tripInfo } = useTripInfo(tripId);
  const { data: expenses = [] } = useTripExpenses(tripId);
  const { data: members = [] } = useTripMembers(tripId);

  const {
    targetCurrency,
    currencySymbol,
    isForeignCurrency,
    exchangeRate,
    isRateLoading,
  } = useTripCurrency(tripId);

  const [showLocalCurrency, setShowLocalCurrency] = useAtom(
    showLocalCurrencyAtom,
  );

  const totalAmount = useMemo(
    () =>
      expenses
        .filter((e) => !e.is_personal)
        .reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  const memberCount = members.length;
  const perPerson = memberCount > 0 ? Math.round(totalAmount / memberCount) : 0;

  const myPersonalAmount = useMemo(() => {
    if (!user?.id) return 0;
    return expenses
      .filter((e) => e.is_personal && e.created_by === user.id)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, user?.id]);

  const myEstimatedTotal = perPerson + myPersonalAmount;

  const { handleShareSettlement } = useShareSettlement({
    tripInfo,
    totalAmount,
    memberCount,
    myPersonalAmount,
    myEstimatedTotal,
    exchangeRate,
    currencySymbol,
    showLocalCurrency,
  });

  const getFormatted = (amount: number) =>
    formatAmount(amount, {
      showLocalCurrency,
      isForeignCurrency,
      exchangeRate,
      targetCurrency,
      currencySymbol,
    });

  const handleBack = () => {
    navigate({ to: "/expense/$tripId", params: { tripId } });
  };

  const primaryPalette = colors.primary.palette;

  return (
    <PageLayout style={{ paddingBottom: "60px" }}>
      <Flex
        align="center"
        justify="space-between"
        py={3}
        position="sticky"
        top={0}
        bg="white"
        zIndex={10}
      >
        <HStack gap={1} flex={1}>
          <IconButton
            aria-label="뒤로 가기"
            variant="ghost"
            size="sm"
            color="gray.700"
            onClick={handleBack}
          >
            <ChevronLeft size={22} />
          </IconButton>
          <VStack align="flex-start" gap={0}>
            <Text fontSize="md" fontWeight="bold" color="gray.900">
              정산 리포트
            </Text>
            <Text fontSize="xs" color="gray.500" lineClamp={1}>
              {tripInfo?.title || "여행"}
            </Text>
          </VStack>
        </HStack>
        <IconButton
          aria-label="정산 리포트 공유"
          variant="ghost"
          size="sm"
          color="gray.600"
          onClick={handleShareSettlement}
        >
          <Share2 size={20} />
        </IconButton>
      </Flex>

      <VStack align="stretch" gap={3} pb={4}>
        {/* 공동 경비 총액 */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box p={2} borderRadius="full" bg={`${primaryPalette}.50`}>
                <Wallet size={20} color={colors.primary.hex[600]} />
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  공동 경비 총액
                </Text>
                <HStack gap={1} align="baseline">
                  {(() => {
                    const { value, unit } = getFormatted(totalAmount);
                    return (
                      <>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="gray.800"
                        >
                          {unit !== "원" && unit}
                          {value}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.500"
                        >
                          {unit === "원" ? "원" : ""}
                        </Text>
                      </>
                    );
                  })()}
                </HStack>
              </VStack>
            </HStack>

            {isForeignCurrency && !isRateLoading && exchangeRate > 0 && (
              <Button
                size="xs"
                variant="ghost"
                color="gray.500"
                onClick={() => setShowLocalCurrency(!showLocalCurrency)}
              >
                <HStack gap={1}>
                  <ArrowLeftRight size={12} />
                  <Text fontSize="xs">
                    {showLocalCurrency ? "원화" : "현지화"}
                  </Text>
                </HStack>
              </Button>
            )}
          </Flex>
        </Box>

        {/* 분담 멤버 수 */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box p={2} borderRadius="full" bg={`${primaryPalette}.50`}>
                <Users size={20} color={colors.primary.hex[600]} />
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  분담 멤버
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {memberCount}명
                </Text>
              </VStack>
            </HStack>
          </Flex>
        </Box>

        {/* 1인당 평균 */}
        <Box
          bg={`${primaryPalette}.50`}
          border="1px solid"
          borderColor={`${primaryPalette}.200`}
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box p={2} borderRadius="full" bg="white">
                <Divide size={20} color={colors.primary.hex[600]} />
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text
                  fontSize="xs"
                  color={`${primaryPalette}.700`}
                  fontWeight="medium"
                >
                  1인당 평균
                </Text>
                {(() => {
                  const { value, unit } = getFormatted(perPerson);
                  return (
                    <HStack gap={1} align="baseline">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        color={`${primaryPalette}.700`}
                      >
                        {unit !== "원" && unit}
                        {value}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={`${primaryPalette}.600`}
                      >
                        {unit === "원" ? "원" : ""}
                      </Text>
                    </HStack>
                  );
                })()}
              </VStack>
            </HStack>
          </Flex>
        </Box>

        {/* 구분선 */}
        <Box borderTop="1px dashed" borderColor="gray.200" my={1} />

        {/* 내 개인 지출 */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box p={2} borderRadius="full" bg={`${colors.accent.palette}.50`}>
                <Bookmark
                  size={20}
                  color={`var(--chakra-colors-${colors.accent.palette}-500)`}
                />
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  내 개인 지출
                </Text>
                {(() => {
                  const { value, unit } = getFormatted(myPersonalAmount);
                  return (
                    <HStack gap={1} align="baseline">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {unit !== "원" && unit}
                        {value}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.500"
                      >
                        {unit === "원" ? "원" : ""}
                      </Text>
                    </HStack>
                  );
                })()}
              </VStack>
            </HStack>
          </Flex>
        </Box>

        {/* 내 예상 총지출 */}
        <Box
          bg="gray.900"
          borderRadius="xl"
          p={4}
        >
          <Flex justify="space-between" align="center">
            <HStack gap={3}>
              <Box p={2} borderRadius="full" bg="whiteAlpha.200">
                <Briefcase size={20} color="white" />
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text fontSize="xs" color="whiteAlpha.700" fontWeight="medium">
                  내 예상 총지출
                </Text>
                {(() => {
                  const { value, unit } = getFormatted(myEstimatedTotal);
                  return (
                    <HStack gap={1} align="baseline">
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        {unit !== "원" && unit}
                        {value}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="whiteAlpha.800"
                      >
                        {unit === "원" ? "원" : ""}
                      </Text>
                    </HStack>
                  );
                })()}
                <Text fontSize="2xs" color="whiteAlpha.600">
                  1인당 평균 + 내 개인 지출
                </Text>
              </VStack>
            </HStack>
          </Flex>
        </Box>

        <Text
          fontSize="2xs"
          color="gray.400"
          textAlign="center"
          px={4}
          mt={2}
        >
          공동 경비만 집계됩니다. 개인 경비(MY 표시)는 제외돼요.
        </Text>
      </VStack>
    </PageLayout>
  );
}
