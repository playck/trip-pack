import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import { VStack, HStack, Input, Button, Text, Box } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import type { Schedule } from "@/features/schedule/types";
import SelectScheduleSheet from "./SelectScheduleSheet";

interface EditExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (
    name: string,
    amount: number,
    scheduleId?: string | null
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
  const [amount, setAmount] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isSelectScheduleOpen, setIsSelectScheduleOpen] = useState(false);

  const { data: schedules } = useTripSchedules(tripId);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setAmount(initialAmount.toLocaleString());

      if (initialScheduleId) {
        const scheduleName = schedules?.find(
          (s) => s.id === initialScheduleId
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
    const parsedAmount = parseInt(amount.replace(/,/g, ""), 10);

    if (trimmedName && parsedAmount > 0) {
      onSaveExpense(trimmedName, parsedAmount, selectedSchedule?.id ?? null);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      const formatted = parseInt(value, 10).toLocaleString();
      setAmount(formatted);
    } else {
      setAmount("");
    }
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule({
      id: schedule.id,
      name: schedule.place_name,
    });
  };

  const isCanSaveExpense =
    name.trim() && amount && parseInt(amount.replace(/,/g, ""), 10) > 0;

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={handleClose} title="경비 수정">
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
              transition="background-color 0.2s"
              cursor="pointer"
              onClick={() => setIsSelectScheduleOpen(true)}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={2}>
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
              autoFocus
            />
          </VStack>

          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              금액
            </Text>
            <Input
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              inputMode="numeric"
              size="lg"
              borderRadius="xl"
            />
          </VStack>

          <HStack gap={2} w="full" h="12" mt={2}>
            <Button
              variant="outline"
              size="lg"
              flex={1}
              fontWeight="medium"
              onClick={handleClose}
            >
              취소
            </Button>

            <Button
              variant="solid"
              size="lg"
              flex={1}
              colorPalette="teal"
              fontWeight="medium"
              onClick={handleSave}
              disabled={!isCanSaveExpense}
            >
              저장
            </Button>
          </HStack>
        </VStack>
      </BottomSheet>

      <SelectScheduleSheet
        isOpen={isSelectScheduleOpen}
        onClose={() => setIsSelectScheduleOpen(false)}
        onSelect={handleSelectSchedule}
        tripId={tripId}
        selectedScheduleId={selectedSchedule?.id}
        selectedDate={selectedDate}
      />
    </>
  );
}
