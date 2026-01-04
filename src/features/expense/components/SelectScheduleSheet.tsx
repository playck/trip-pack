import { useMemo } from "react";
import { VStack, Text, Box, HStack, Badge } from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import type { Schedule } from "@/features/schedule/types";
import { colors } from "@/shared/constants/colors";

interface SelectScheduleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  onSelect: (schedule: Schedule) => void;
  selectedScheduleId?: string;
  selectedDate?: string;
}

export default function SelectScheduleSheet({
  isOpen,
  onClose,
  tripId,
  onSelect,
  selectedScheduleId,
  selectedDate,
}: SelectScheduleSheetProps) {
  const { data: schedules } = useTripSchedules(tripId);

  // 일정을 날짜(day_number)별로 그룹화
  const schedulesByDay = useMemo(() => {
    if (!schedules) return [];

    const filteredSchedules = selectedDate
      ? schedules.filter((s) => s.schedule_date === selectedDate)
      : schedules;

    const grouped: Record<number, Schedule[]> = {};

    filteredSchedules.forEach((schedule) => {
      const day = schedule.day_number;
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(schedule);
    });

    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((day) => ({
        day,
        items: grouped[day],
      }));
  }, [schedules, selectedDate]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="일정 선택"
      minHeight="60vh"
    >
      <VStack align="stretch" gap={6} px={4} pt={2} pb={8}>
        {schedulesByDay.length === 0 ? (
          <Box textAlign="center" py={8} color="gray.500">
            해당 날짜에 등록된 일정이 없습니다.
          </Box>
        ) : (
          schedulesByDay.map(({ day, items }) => (
            <VStack key={day} align="stretch" gap={2}>
              <Text fontSize="sm" fontWeight="bold" color="gray.500" px={1}>
                Day {day}
              </Text>

              <VStack align="stretch" gap={2}>
                {items.map((schedule) => {
                  const isSelected = selectedScheduleId === schedule.id;

                  return (
                    <Box
                      key={schedule.id}
                      p={3}
                      bg={
                        isSelected ? `${colors.primary.palette}.50` : "gray.50"
                      }
                      borderWidth="1px"
                      borderColor={
                        isSelected ? colors.primary.solid : "transparent"
                      }
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(schedule);
                        onClose();
                      }}
                    >
                      <HStack gap={3}>
                        <Box
                          color={isSelected ? colors.primary.solid : "gray.400"}
                        >
                          <MapPin size={18} />
                        </Box>
                        <VStack align="start" gap={0} flex={1}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={isSelected ? "gray.900" : "gray.700"}
                          >
                            {schedule.place_name}
                          </Text>
                          {schedule.category && (
                            <Text fontSize="xs" color="gray.500">
                              {schedule.category}
                            </Text>
                          )}
                        </VStack>
                        {isSelected && (
                          <Badge
                            colorPalette={colors.primary.palette}
                            variant="solid"
                            size="sm"
                          >
                            선택됨
                          </Badge>
                        )}
                      </HStack>
                    </Box>
                  );
                })}
              </VStack>
            </VStack>
          ))
        )}
      </VStack>
    </BottomSheet>
  );
}
