import { useMemo } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Timeline,
  IconButton,
} from "@chakra-ui/react";
import { Plane, PlaneLanding, MoveRight, MoreVertical } from "lucide-react";
import dayjs from "dayjs";
import { colors, hexColors, textColors } from "@/shared/constants/colors";
import { useFlightStatus } from "@/features/flight/services/useFlightQueries";
import { FlightStatusBadge } from "@/features/flight/components";
import { formatFlightTime } from "@/features/flight/utils";
import { AIRPORT_NAMES, TERMINAL_NAMES } from "@/features/flight/types";
import type { TripFlight } from "@/features/flight/types";

interface FlightScheduleItemProps {
  flight: TripFlight;
  destinationName?: string;
  onOpenActionSheet?: () => void;
}

export default function FlightScheduleItem({
  flight,
  destinationName,
  onOpenActionSheet,
}: FlightScheduleItemProps) {
  const isDeparture = flight.flight_type === "departure";
  const isFlightDay = useMemo(
    () => dayjs().format("YYYY-MM-DD") === flight.scheduled_date,
    [flight.scheduled_date],
  );

  // 출발 당일에만 실시간 운항 정보 조회
  const flightForStatus = isFlightDay ? flight : undefined;
  const { data: status } = useFlightStatus(flightForStatus);

  const hasTimeChange =
    !!status?.estimatedDateTime &&
    status.estimatedDateTime !== status.scheduleDateTime;

  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator bg="white">
          {isDeparture ? <Plane size={14} /> : <PlaneLanding size={14} />}
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content width="full" ml={-2} pb="16px">
        <Box
          bg={colors.primary.subtle}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={colors.primary.muted}
          overflow="hidden"
          cursor="default"
        >
          {/* 헤더 */}
          <HStack px={3} py={1.5} justify="space-between" align="center">
            <HStack gap={1.5}>
              <Text fontSize="xs" fontWeight="bold" color={colors.primary.fg}>
                {isDeparture ? "출발편" : "리턴편"}
              </Text>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={colors.primary.fg}
              >
                {flight.flight_id}
              </Text>
            </HStack>
            <HStack gap={1}>
              {status?.remark && <FlightStatusBadge remark={status.remark} />}
              {onOpenActionSheet && (
                <IconButton
                  size="2xs"
                  variant="ghost"
                  aria-label="항공편 관리"
                  onClick={onOpenActionSheet}
                  color="gray.400"
                >
                  <MoreVertical size={14} />
                </IconButton>
              )}
            </HStack>
          </HStack>

          {/* 노선 정보 */}
          <Box px={3} py={2} bg="white">
            <HStack justify="space-around" align="center">
              <VStack gap={0} flex={1} align="center">
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  {AIRPORT_NAMES[flight.departure_airport] ||
                    flight.departure_airport ||
                    destinationName ||
                    "출발지"}
                </Text>
                <Text fontSize="2xs" color="gray.400">
                  {isDeparture
                    ? flight.departure_airport || "ICN"
                    : status?.airportCode || flight.departure_airport || ""}
                </Text>
              </VStack>

              <VStack gap={0} align="center" px={2}>
                <MoveRight size={16} color={hexColors.gray[500]} />
              </VStack>

              <VStack gap={0} flex={1} align="center">
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  {AIRPORT_NAMES[flight.arrival_airport] ||
                    flight.arrival_airport ||
                    status?.airport ||
                    destinationName ||
                    "도착지"}
                </Text>
                <Text fontSize="2xs" color="gray.400">
                  {isDeparture
                    ? status?.airportCode || flight.arrival_airport || ""
                    : flight.arrival_airport || "ICN"}
                </Text>
              </VStack>
            </HStack>

            {/* 기본 정보: 예정시간, 항공사 */}
            <Box px={2}>
              {(flight.scheduled_time || flight.airline) && (
                <HStack
                  mt={2}
                  pt={2}
                  borderTopWidth="1px"
                  borderColor="gray.100"
                  gap={3}
                >
                  {flight.scheduled_time && (
                    <VStack align="start" gap={0}>
                      <Text fontSize="2xs" color={textColors.subtle}>
                        예정시간
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {flight.scheduled_time}
                      </Text>
                    </VStack>
                  )}
                  {flight.airline && (
                    <VStack align="start" gap={0}>
                      <Text fontSize="2xs" color={textColors.subtle}>
                        항공사
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {flight.airline}
                      </Text>
                    </VStack>
                  )}
                </HStack>
              )}

              {/* 실시간 운항 정보 (출발 당일에만 표시) */}
              {isFlightDay && status && (
                <HStack
                  mt={2}
                  pt={2}
                  borderTopWidth="1px"
                  borderColor="gray.100"
                  justify="space-between"
                  wrap="wrap"
                  gap={1}
                >
                  {hasTimeChange && (
                    <VStack align="start" gap={0}>
                      <Text fontSize="2xs" color={textColors.subtle}>
                        변경시간
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="orange.500"
                      >
                        {formatFlightTime(status.estimatedDateTime)}
                      </Text>
                    </VStack>
                  )}

                  {status.gatenumber && (
                    <VStack align="start" gap={0}>
                      <Text fontSize="2xs" color={textColors.subtle}>
                        탑승구
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {status.gatenumber}
                      </Text>
                    </VStack>
                  )}

                  {status.terminalId && (
                    <VStack align="start" gap={0}>
                      <Text fontSize="2xs" color={textColors.subtle}>
                        터미널
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {TERMINAL_NAMES[status.terminalId] || status.terminalId}
                      </Text>
                    </VStack>
                  )}
                </HStack>
              )}
            </Box>
          </Box>
        </Box>
      </Timeline.Content>
    </Timeline.Item>
  );
}
