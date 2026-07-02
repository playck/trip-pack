import { useMemo } from "react";
import { Box, HStack, VStack, Text, IconButton, Badge } from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import {
  backgrounds,
  statusColors,
  textColors,
} from "@/shared/constants/colors";
import { useParkingStatus } from "../services/useParkingQueries";
import { getCongestion, groupParkingLots } from "../utils";
import type { ParkingGroup } from "../types";

// 인천공항 주차장 현황 표현 컴포넌트 (스스로 데이터를 불러옴).
// 모달/위젯 등 어떤 컨테이너에도 넣어 재사용한다.
export default function ParkingStatusContent() {
  const {
    data: lots,
    isLoading,
    isError,
    isFetching,
    isPaused,
    refetch,
  } = useParkingStatus();

  const groups = useMemo(() => groupParkingLots(lots ?? []), [lots]);
  const updatedAt = lots?.[0]?.updatedAt;
  const hasData = groups.length > 0;

  // 데이터가 없을 때의 상태 문구 — 분기가 서로 배타적이도록 한 곳에서 결정
  const getEmptyMessage = () => {
    if (hasData) return null;
    if (isPaused) return "오프라인 상태예요. 연결 후 다시 시도해주세요";
    if (isLoading) return "주차장 현황 조회중...";
    if (isError) return "주차장 현황을 가져올 수 없습니다";
    return "표시할 주차장 정보가 없습니다";
  };
  const emptyMessage = getEmptyMessage();

  // 데이터는 있지만 갱신이 실패했거나 오프라인인 경우: 목록은 유지하고 안내만 덧붙인다
  const isStale = hasData && (isError || isPaused);

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
        잔여 {group.available.toLocaleString()}면 / 총{" "}
        {group.total.toLocaleString()}면
      </Text>
    </Box>
  );
}
