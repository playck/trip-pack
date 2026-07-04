import { useMemo } from "react";
import { Box, HStack, VStack, Text, IconButton, Badge } from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import {
  backgrounds,
  borderColors,
  statusColors,
  textColors,
} from "@/shared/constants/colors";
import { useParkingStatus } from "../services/useParkingQueries";
import { getCongestion, groupParkingLots, lotsToGroups } from "../utils";
import { estimateParkingFee, PARKING_FEE_ROWS } from "../fees";
import type { ParkingAirport, ParkingGroup } from "../types";

interface ParkingStatusContentProps {
  airport?: ParkingAirport;
  tripStartDate?: string;
  tripDays?: number;
}

export default function ParkingStatusContent({
  airport = "ICN",
  tripStartDate,
  tripDays,
}: ParkingStatusContentProps) {
  const {
    data: lots,
    isLoading,
    isError,
    isFetching,
    isPaused,
    refetch,
  } = useParkingStatus(airport);

  // 인천은 터미널·유형별 집계, 김포는 주차장 단위 그대로 노출
  const groups = useMemo(
    () =>
      airport === "ICN"
        ? groupParkingLots(lots ?? [])
        : lotsToGroups(lots ?? []),
    [airport, lots],
  );
  const updatedAt = lots?.[0]?.updatedAt;
  const hasData = groups.length > 0;

  const getEmptyMessage = () => {
    if (hasData) return null;
    if (isPaused) return "오프라인 상태예요. 연결 후 다시 시도해주세요";
    if (isLoading) return "주차장 현황 조회중...";
    if (isError) return "주차장 현황을 가져올 수 없습니다";
    return "표시할 주차장 정보가 없습니다";
  };
  const emptyMessage = getEmptyMessage();

  const isStale = hasData && (isError || isPaused);

  // 여행 기간 기준 예상 주차 요금 — 출발일·일수가 전달됐을 때만
  const feeEstimate =
    tripStartDate && tripDays
      ? estimateParkingFee(airport, tripStartDate, tripDays)
      : null;

  return (
    <VStack align="stretch" gap={1.5} pb={6}>
      {/* 기준 시각 + 새로고침 (오른쪽 정렬, 컴팩트) */}
      <HStack justify="flex-end" align="center" gap={1} mt={-1}>
        <Text fontSize="xs" color={textColors.subtle}>
          {updatedAt ? `${updatedAt} 기준` : "실시간 현황"}
        </Text>
        <IconButton
          size="2xs"
          variant="ghost"
          aria-label="주차장 현황 새로고침"
          onClick={() => refetch()}
          disabled={isFetching}
          color={textColors.subtle}
        >
          <RefreshCw
            size={14}
            style={{
              animation: isFetching ? "spin 1s linear infinite" : "none",
            }}
          />
        </IconButton>
      </HStack>

      {emptyMessage && (
        <Text fontSize="sm" color={textColors.subtle} textAlign="center" py={6}>
          {emptyMessage}
        </Text>
      )}

      {isStale && (
        <Text
          fontSize="xs"
          color={statusColors.warning.text}
          textAlign="center"
        >
          지금은 갱신할 수 없어요 — 마지막으로 불러온 정보입니다
        </Text>
      )}

      {hasData && (
        <VStack align="stretch" gap={3.5}>
          {groups.map((group) => (
            <ParkingGroupRow key={group.key} group={group} />
          ))}
        </VStack>
      )}

      {/* 주차 요금 안내 (공식 요금, 정적 데이터) */}
      <Box mt={2} pt={3} borderTopWidth="1px" borderColor={borderColors.subtle}>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color={textColors.secondary}
          mb={1.5}
        >
          주차 요금 (소형차 기준)
        </Text>
        <VStack align="stretch" gap={1}>
          {PARKING_FEE_ROWS[airport].map((row) => (
            <HStack
              key={row.label}
              justify="space-between"
              align="baseline"
              gap={2}
            >
              <Text
                fontSize="xs"
                fontWeight="medium"
                color={textColors.primary}
                flexShrink={0}
              >
                {row.label}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="medium"
                color={textColors.secondary}
                textAlign="right"
              >
                {row.note}
              </Text>
            </HStack>
          ))}
        </VStack>
        {feeEstimate && (
          <Box
            mt={2}
            px={3}
            py={2}
            bg={backgrounds.muted}
            borderWidth="1px"
            borderColor={borderColors.default}
            borderRadius="md"
          >
            <Text fontSize="xs" fontWeight="semibold" color={textColors.primary}>
              주차 {tripDays}일 기준 {feeEstimate.basisLabel} 약{" "}
              {feeEstimate.amount.toLocaleString("ko-KR")}원
            </Text>
            <Text fontSize="2xs" color={textColors.muted} mt={0.5}>
              {airport === "GMP"
                ? "날짜별 평일·주말(금~일) 요금 합산 · 공휴일 할증과 각종 할인은 제외"
                : "장기주차장 1일 정액 기준 · 각종 할인은 반영되지 않아요"}
            </Text>
          </Box>
        )}
      </Box>
    </VStack>
  );
}

function ParkingGroupRow({ group }: { group: ParkingGroup }) {
  const congestion = getCongestion(group.occupancyRate);

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={1.5}>
        <Text fontSize="sm" fontWeight="semibold" color={textColors.secondary}>
          {group.label}
        </Text>
        <Badge
          px={2.5}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          bg={congestion.bg}
          color={congestion.text}
        >
          {congestion.level} {group.occupancyRate}%
        </Badge>
      </HStack>
      <Box
        h="8px"
        bg={backgrounds.muted}
        borderRadius="full"
        overflow="hidden"
        aria-hidden
      >
        <Box
          h="full"
          w={`${group.occupancyRate}%`}
          bg={congestion.bar}
          borderRadius="full"
          transition="width 0.3s ease-in-out"
        />
      </Box>
      <Text fontSize="xs" color={textColors.subtle} mt={1}>
        잔여 {group.available.toLocaleString("ko-KR")}면 / 총{" "}
        {group.total.toLocaleString("ko-KR")}면
      </Text>
    </Box>
  );
}
