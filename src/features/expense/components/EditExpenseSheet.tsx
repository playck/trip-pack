import { useState, useEffect, useCallback } from "react";
import { Link2 } from "lucide-react";
import { VStack, HStack, Input, Button, Text, Box } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import type { Schedule } from "@/features/schedule/types";
import { useAmountInput } from "../hooks/useAmountInput";
import SelectScheduleSheet from "./SelectScheduleSheet";
import AmountCalculator from "./calculator/AmountCalculator";

interface EditExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (
    name: string,
    amount: number,
    scheduleId?: string | null,
  ) => void;
  initialName: string;
  initialAmount: number;
  initialScheduleId?: string | null;
  tripId: string;
  selectedDate?: string;
}

export default function EditExpenseSheet({
  isOpen,
  onClose,
  onSaveExpense,
  initialName,
  initialAmount,
  initialScheduleId,
  tripId,
  selectedDate,
}: EditExpenseSheetProps) {
  const [name, setName] = useState("");
  const { parsedAmount, isValidAmount, setAmountFromNumber } =
    useAmountInput();
  const [calculatorInitialValue, setCalculatorInitialValue] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleAmountFromCalculator = useCallback(
    (value: number) => {
      setAmountFromNumber(value);
    },
    [setAmountFromNumber],
  );
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isSelectScheduleOpen, setIsSelectScheduleOpen] = useState(false);

  const { data: schedules } = useTripSchedules(tripId);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setCalculatorInitialValue(initialAmount);

      if (initialScheduleId) {
        const scheduleName = schedules?.find(
          (s) => s.id === initialScheduleId,
        )?.place_name;
        setSelectedSchedule({
          id: initialScheduleId,
          name: scheduleName || "연결된 일정",
        });
      } else {
        setSelectedSchedule(null);
      }
    }
  }, [isOpen, initialName, initialAmount, initialScheduleId, schedules]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName && isValidAmount) {
      onSaveExpense(trimmedName, parsedAmount, selectedSchedule?.id ?? null);
    }
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule({
      id: schedule.id,
      name: schedule.place_name,
    });
  };

  const isCanSaveExpense = name.trim() && isValidAmount && !isCalculating;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="경비 수정"
        adjustForKeyboard
        primaryButton={{
          onClick: handleSave,
          disabled: !isCanSaveExpense,
        }}
        secondaryButton={{
          onClick: onClose,
        }}
      >
        <VStack gap={4} w="full" p={4}>
          {/* 일정 정보 표시 */}
          {selectedSchedule && (
            <Box
              w="full"
              p={2}
              bg={`${colors.primary.palette}.50`}
              borderRadius="lg"
              borderLeft="4px solid"
              borderColor={colors.primary.palette}
              cursor="pointer"
              onClick={() => setIsSelectScheduleOpen(true)}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={2} flex={1} minW={0}>
                  <Text fontSize="xs" color="gray.600" whiteSpace="nowrap">
                    연결된 일정 -
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.800"
                    lineClamp={1}
                  >
                    {selectedSchedule.name}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  변경
                </Text>
              </HStack>
            </Box>
          )}

          <VStack gap={2} w="full">
            <HStack justify="space-between" align="center" w="full">
              <Text fontSize="md" fontWeight="medium">
                내용
              </Text>
              {!selectedSchedule && (
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.500"
                  fontWeight="medium"
                  h="24px"
                  px={2}
                  onClick={() => setIsSelectScheduleOpen(true)}
                >
                  <HStack gap={1}>
                    <Link2 size={12} />
                    <Text fontSize="xs">일정 연동</Text>
                  </HStack>
                </Button>
              )}
            </HStack>
            <Input
              placeholder="예) 조식"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
              borderRadius="xl"
            />
          </VStack>

          <AmountCalculator
            onAmountChange={handleAmountFromCalculator}
            onCalculatingChange={setIsCalculating}
            initialValue={calculatorInitialValue}
          />
        </VStack>
      </BottomSheet>

      <SelectScheduleSheet
        isOpen={isSelectScheduleOpen}
        onClose={() => setIsSelectScheduleOpen(false)}
        onSelect={handleSelectSchedule}
        onUnlink={() => setSelectedSchedule(null)}
        tripId={tripId}
        selectedScheduleId={selectedSchedule?.id}
        selectedDate={selectedDate}
      />
    </>
  );
}
