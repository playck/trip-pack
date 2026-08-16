import { VStack, Box, Text } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { getTripDays, getDayDate } from "@/shared/utiles/date";
import { borderColors, textColors } from "@/shared/constants/colors";

interface MoveDateBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentDayNumber: number;
  tripStartDate: string;
  tripEndDate: string;
  onSelectDay: (dayNumber: number) => void;
  isLoading?: boolean;
  title?: string;
}

export default function MoveDateBottomSheet({
  isOpen,
  onClose,
  currentDayNumber,
  tripStartDate,
  tripEndDate,
  onSelectDay,
  isLoading = false,
  title = "이동할 날짜 선택",
}: MoveDateBottomSheetProps) {
  const totalDays = getTripDays(tripStartDate, tripEndDate);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <VStack gap={0} pb={4} px={2}>
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(
          (day, index, array) => {
            const isCurrentDay = day === currentDayNumber;
            const dayDate = getDayDate(tripStartDate, day);
            const isLastItem = index === array.length - 1;

            return (
              <Box
                key={day}
                w="full"
                px={3}
                py={3.5}
                borderBottomWidth={isLastItem ? "0" : "1px"}
                borderColor={borderColors.default}
                cursor={isCurrentDay || isLoading ? "not-allowed" : "pointer"}
                opacity={isCurrentDay ? 0.5 : 1}
                bg={isCurrentDay ? "gray.50" : "white"}
                onClick={() => {
                  if (!isCurrentDay && !isLoading) {
                    onSelectDay(day);
                  }
                }}
              >
                <Text fontWeight="medium" fontSize="md">
                  {day}일차 ({dayDate})
                  {isCurrentDay && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={textColors.muted}
                    >
                      (현재)
                    </Text>
                  )}
                </Text>
              </Box>
            );
          }
        )}
      </VStack>
    </BottomSheet>
  );
}
