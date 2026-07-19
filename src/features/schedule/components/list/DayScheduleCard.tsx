import { useState } from "react";
import {
  HStack,
  Text,
  Box,
  IconButton,
  Timeline,
  Button,
} from "@chakra-ui/react";
import { MapPin, StickyNote, Edit, Plane, PlaneLanding } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import {
  colors,
  componentColors,
  borderColors,
  textColors,
  hexColors,
} from "@/shared/constants/colors";
import {
  useTripFlights,
  useDeleteFlight,
} from "@/features/flight/services/useFlightQueries";
import { AddFlightSheet } from "@/features/flight/components";
import type { TripFlight } from "@/features/flight/types";
import { useSchedulesByDay } from "../../hooks/useSchedulesByDay";
import ScheduleItem from "../schedule-items/ScheduleItem";
import MemoItem from "../schedule-items/MemoItem";
import FlightScheduleItem from "../schedule-items/FlightScheduleItem";
import ParkingScheduleItem from "../schedule-items/ParkingScheduleItem";
import FlightActionSheet from "../modals/FlightActionSheet";
import { getParkingAirport } from "@/features/airport-parking/utils";
import { isMemo } from "../../utils/scheduleHelpers";

interface DayScheduleCardProps {
  tripId: string;
  dayNumber: number;
  date: string;
  formattedDate: string;
  cardStickyTop?: number;
  onAddSchedule?: () => void;
  onAddMemo?: () => void;
  startDate?: string;
  endDate?: string;
  tripTotalDays?: number;
  isLastDay?: boolean;
  regionName?: string;
}

export default function DayScheduleCard({
  tripId,
  dayNumber,
  formattedDate,
  cardStickyTop = 0,
  onAddSchedule,
  onAddMemo,
  startDate,
  endDate,
  tripTotalDays,
  isLastDay = false,
  regionName,
}: DayScheduleCardProps) {
  const navigate = useNavigate();
  const { schedules, isLoading } = useSchedulesByDay(tripId, dayNumber);
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [addFlightType, setAddFlightType] = useState<"departure" | "return">(
    "departure",
  );
  const [editFlight, setEditFlight] = useState<TripFlight | undefined>();
  const [actionFlight, setActionFlight] = useState<TripFlight | undefined>();
  const [isFlightActionOpen, setIsFlightActionOpen] = useState(false);

  const isFirstDay = dayNumber === 1;
  const showFlightSection = isFirstDay || isLastDay;

  const { data: flights } = useTripFlights(showFlightSection ? tripId : "");
  const deleteFlight = useDeleteFlight(tripId);

  const departureFlight = flights?.find(
    (f: TripFlight) => f.flight_type === "departure",
  );
  const returnFlight = flights?.find(
    (f: TripFlight) => f.flight_type === "return",
  );

  // 노출 조건(지원 공항 출발편 + D-0)은 airport-parking 정책 함수가 판단
  const parkingAirport = isFirstDay
    ? getParkingAirport(departureFlight)
    : null;

  const goToEditDayPage = () => {
    navigate({
      to: "/schedule/edit/$tripId/$dayNumber",
      params: { tripId, dayNumber: dayNumber.toString() },
    });
  };

  const renderTimelineContent = () => {
    if (isLoading) return <TimelineLoading />;
    if (schedules.length === 0 && !hasFlight())
      return <TimelineEmpty onAddSchedule={onAddSchedule} />;

    return (
      <Timeline.Root size="sm" variant="subtle" gap={1.5}>
        {/* 첫째날: 출발편 */}
        {isFirstDay && departureFlight && (
          <FlightScheduleItem
            flight={departureFlight}
            destinationName={regionName}
            onOpenActionSheet={() => {
              setActionFlight(departureFlight);
              setIsFlightActionOpen(true);
            }}
          />
        )}

        {/* 출발 당일: 출발 공항 주차장 현황 */}
        {parkingAirport && (
          <ParkingScheduleItem
            airport={parkingAirport}
            tripStartDate={startDate}
            tripDays={tripTotalDays}
          />
        )}

        {schedules.map((schedule) =>
          isMemo(schedule) ? (
            <MemoItem key={schedule.id} memo={schedule} />
          ) : (
            <ScheduleItem key={schedule.id} schedule={schedule} />
          ),
        )}

        {/* 마지막날: 리턴편 */}
        {isLastDay && returnFlight && (
          <FlightScheduleItem
            flight={returnFlight}
            destinationName={regionName}
            onOpenActionSheet={() => {
              setActionFlight(returnFlight);
              setIsFlightActionOpen(true);
            }}
          />
        )}
      </Timeline.Root>
    );
  };

  const hasFlight = () => {
    if (isFirstDay && departureFlight) return true;
    if (isLastDay && returnFlight) return true;
    return false;
  };

  const canAddDeparture = isFirstDay && !departureFlight;
  const canAddReturn = isLastDay && !returnFlight;

  const handleOpenAddFlight = (type: "departure" | "return") => {
    setEditFlight(undefined);
    setAddFlightType(type);
    setIsAddFlightOpen(true);
  };

  const flightStartDate = startDate || "";
  const flightEndDate = endDate || "";

  return (
    <>
      <Box
        borderWidth="1px"
        borderColor={borderColors.default}
        borderTopRadius="lg"
        bg={componentColors.card.background}
      >
        {/* 헤더 */}
        <HStack
          px={3}
          py={1}
          bg={colors.primary.subtle}
          borderBottomWidth="1px"
          borderTopRadius="lg"
          borderColor={borderColors.default}
          justify="space-between"
          align="center"
          position="sticky"
          top={`${cardStickyTop}px`}
          zIndex={5}
          transition="top 0.3s ease-in-out"
        >
          <HStack gap={1.5} align="baseline">
            <Text fontSize="md" fontWeight="bold" color={colors.primary.fg}>
              {dayNumber}일차
            </Text>
            <Text fontSize="xs" fontWeight="medium" color={textColors.tertiary}>
              {formattedDate}
            </Text>
          </HStack>

          <HStack gap={1}>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="일정 추가"
              onClick={onAddSchedule}
              colorPalette={colors.primary.palette}
              _hover={{ bg: "whiteAlpha.500" }}
            >
              <MapPin size={14} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="메모 추가"
              onClick={onAddMemo}
              colorPalette={colors.neutral.palette}
              _hover={{ bg: "whiteAlpha.500" }}
            >
              <StickyNote size={14} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="일정 관리"
              onClick={goToEditDayPage}
              colorPalette={colors.neutral.palette}
              _hover={{ bg: "whiteAlpha.500" }}
            >
              <Edit size={14} />
            </IconButton>
          </HStack>
        </HStack>

        <Box p={3} pb={2} minH="80px" borderBottomRadius="lg">
          {/* 항공편 등록 버튼 */}
          {(canAddDeparture || canAddReturn) && (
            <Box mb={2.5} display="flex" flexDirection="column" gap={2}>
              {canAddDeparture && (
                <Button
                  w="full"
                  size="sm"
                  variant="outline"
                  borderColor={borderColors.emphasized}
                  borderWidth="2px"
                  borderStyle="dashed"
                  onClick={() => handleOpenAddFlight("departure")}
                >
                  <Plane size={14} color={hexColors.teal[500]} />
                  <Text ml={1} fontSize="sm">
                    출발 항공편 등록하기
                  </Text>
                </Button>
              )}
              {canAddReturn && (
                <Button
                  w="full"
                  size="sm"
                  variant="outline"
                  borderColor={borderColors.emphasized}
                  borderWidth="2px"
                  borderStyle="dashed"
                  onClick={() => handleOpenAddFlight("return")}
                >
                  <PlaneLanding size={14} color={hexColors.teal[500]} />
                  <Text ml={1} fontSize="sm">
                    리턴 항공편 등록하기
                  </Text>
                </Button>
              )}
            </Box>
          )}

          {renderTimelineContent()}
        </Box>
      </Box>

      {/* 항공편 액션시트 */}
      {actionFlight && (
        <FlightActionSheet
          isOpen={isFlightActionOpen}
          onClose={() => {
            setIsFlightActionOpen(false);
            setActionFlight(undefined);
          }}
          flightName={`${actionFlight.flight_type === "departure" ? "출발편" : "리턴편"} ${actionFlight.flight_id}`}
          onEdit={() => {
            setEditFlight(actionFlight);
            setAddFlightType(actionFlight.flight_type);
            setIsAddFlightOpen(true);
          }}
          onDelete={() => {
            deleteFlight.mutate(actionFlight.id);
          }}
        />
      )}

      {/* 항공편 등록/수정 바텀시트 */}
      {showFlightSection && (flightStartDate || flightEndDate) && (
        <AddFlightSheet
          isOpen={isAddFlightOpen}
          onClose={() => {
            setIsAddFlightOpen(false);
            setEditFlight(undefined);
          }}
          tripId={tripId}
          startDate={flightStartDate}
          endDate={flightEndDate}
          defaultFlightType={addFlightType}
          initialFlight={editFlight}
        />
      )}
    </>
  );
}

const TimelineLoading = () => (
  <Box p={6} textAlign="center">
    <Text fontSize="sm" color={textColors.subtle}>
      일정을 불러오고 있어요...
    </Text>
  </Box>
);

const TimelineEmpty = ({ onAddSchedule }: { onAddSchedule?: () => void }) => (
  <Box
    p={6}
    borderRadius="md"
    borderWidth="2px"
    borderStyle="dashed"
    borderColor={borderColors.emphasized}
    textAlign="center"
    cursor="pointer"
    onClick={onAddSchedule}
  >
    <Text fontSize="sm" color={textColors.subtle}>
      일정을 추가해주세요
    </Text>
  </Box>
);
