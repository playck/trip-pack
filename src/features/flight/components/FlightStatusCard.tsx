import { useState } from "react";
import { Box, HStack, VStack, Text, IconButton } from "@chakra-ui/react";
import {
  Plane,
  PlaneLanding,
  Trash2,
  RefreshCw,
  MoveRight,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { colors, hexColors, statusColors } from "@/shared/constants/colors";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useFlightStatus } from "../services/useFlightQueries";
import { formatFlightTime } from "../utils";
import { TERMINAL_NAMES } from "../types";
import type { TripFlight } from "../types";
import FlightStatusBadge from "./FlightStatusBadge";

interface FlightStatusCardProps {
  flight: TripFlight;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function FlightStatusCard({
  flight,
  onDelete,
  isDeleting,
}: FlightStatusCardProps) {
  const {
    data: status,
    isLoading,
    isError,
    isFetching,
  } = useFlightStatus(flight);
  const queryClient = useQueryClient();
  const isDeparture = flight.flight_type === "departure";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: ["flightStatus", flight.flight_id, flight.flight_type],
    });
  };

  const handleConfirmDelete = () => {
    onDelete(flight.id);
    setShowDeleteConfirm(false);
  };

  return (
    <Box
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      {/* 헤더 */}
      <HStack px={4} py={1} bg={colors.primary.subtle} justify="space-between">
        <HStack gap={2}>
          {isDeparture ? (
            <Plane size={16} color={hexColors.teal[600]} />
          ) : (
            <PlaneLanding size={16} color={hexColors.teal[600]} />
          )}
          <Text fontSize="sm" fontWeight="bold" color={colors.primary.fg}>
            {isDeparture ? "출발편" : "리턴편"}
          </Text>
        </HStack>
        <HStack gap={1}>
          <IconButton
            aria-label="새로고침"
            variant="ghost"
            size="xs"
            color="gray.500"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              size={14}
              style={{
                animation: isFetching ? "spin 1s linear infinite" : "none",
              }}
            />
          </IconButton>
          <IconButton
            aria-label="삭제"
            variant="ghost"
            size="xs"
            disabled={isDeleting}
            color={statusColors.error.palette}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={14} />
          </IconButton>
        </HStack>
      </HStack>

      {/* 본문 */}
      <VStack px={4} py={3} gap={3} align="stretch">
        {/* 항공편 기본 정보 */}
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={0.5}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {flight.flight_id}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {flight.airline}
            </Text>
          </VStack>
          <VStack align="end" gap={0.5}>
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              {flight.scheduled_date}
            </Text>
            {flight.scheduled_time && (
              <Text fontSize="xs" color="gray.500">
                예정 {flight.scheduled_time}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* 노선 정보 */}
        <HStack justify="space-around" align="center" px={4}>
          <VStack gap={0} flex={1} align="center">
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              {flight.departure_airport === "ICN"
                ? "인천"
                : flight.departure_airport}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {isDeparture ? "ICN" : status?.airportCode || ""}
            </Text>
          </VStack>
          <VStack gap={1} align="center" px={4}>
            <Plane size={24} color={hexColors.gray[400]} />
            <MoveRight size={18} color={hexColors.gray[300]} />
          </VStack>
          <VStack gap={0} flex={1} align="center">
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              {flight.arrival_airport === "ICN"
                ? "인천"
                : flight.arrival_airport}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {isDeparture ? status?.airportCode || "" : "ICN"}
            </Text>
          </VStack>
        </HStack>

        {/* 실시간 운항 현황 */}
        {isLoading && (
          <Box py={2} textAlign="center">
            <Text fontSize="xs" color="gray.400">
              운항 현황 조회중...
            </Text>
          </Box>
        )}

        {isError && (
          <Box py={2} textAlign="center">
            <Text fontSize="xs" color="gray.400">
              운항 현황을 가져올 수 없습니다
            </Text>
          </Box>
        )}

        {status && (
          <Box bg="gray.50" borderRadius="lg" px={3} py={2.5}>
            <HStack align="center" mb={2}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.600">
                실시간 운항 현황
              </Text>
              <FlightStatusBadge remark={status.remark} />
            </HStack>
            <HStack justify="space-between" wrap="wrap" gap={2}>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" color="gray.500">
                  예정시간
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatFlightTime(status.scheduleDateTime)}
                </Text>
              </VStack>
              {status.estimatedDateTime &&
                status.estimatedDateTime !== status.scheduleDateTime && (
                  <VStack align="start" gap={0}>
                    <Text fontSize="xs" color="gray.500">
                      변경시간
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color="orange.500">
                      {formatFlightTime(status.estimatedDateTime)}
                    </Text>
                  </VStack>
                )}
              {status.gatenumber && (
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    탑승구
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {status.gatenumber}
                  </Text>
                </VStack>
              )}
              {status.terminalId && (
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    터미널
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {TERMINAL_NAMES[status.terminalId] || status.terminalId}
                  </Text>
                </VStack>
              )}
              {status.chkinrange && (
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    체크인
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {status.chkinrange}
                  </Text>
                </VStack>
              )}
              {status.carousel && (
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    수하물
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {status.carousel}
                  </Text>
                </VStack>
              )}
              {status.exitnumber && (
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="gray.500">
                    출구
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {status.exitnumber}
                  </Text>
                </VStack>
              )}
            </HStack>
          </Box>
        )}
      </VStack>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="항공편 삭제"
        message={`${flight.flight_id} (${isDeparture ? "출발편" : "리턴편"})을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        isDangerous
      />
    </Box>
  );
}
