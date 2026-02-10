import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Link2 } from "lucide-react";
import { useAtomValue } from "jotai";
import { VStack, HStack, Input, Button, Text, Box } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import type { Schedule } from "@/features/schedule/types";
import { useTripCurrency } from "../hooks/useTripCurrency";
import { useAmountInput } from "../hooks/useAmountInput";
import { showLocalCurrencyAtom } from "../store/currencyStore";
import SelectScheduleSheet from "./SelectScheduleSheet";

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (name: string, amount: number, scheduleId?: string) => void;
  scheduleName?: string;
  scheduleId?: string;
  date?: string;
  tripId: string;
}

interface SelectedScheduleInfo {
  id: string;
  name: string;
}

export default function AddExpenseSheet({
  isOpen,
  onClose,
  onSaveExpense,
  scheduleName,
  scheduleId,
  date,
  tripId,
}: AddExpenseSheetProps) {
  const { currencySymbol, isForeignCurrency, exchangeRate } =
    useTripCurrency(tripId);

  const showLocalCurrency = useAtomValue(showLocalCurrencyAtom);

  const {
    amount,
    handleAmountChange,
    isValidAmount,
    currencyType,
    toggleCurrencyType,
    estimatedKrw,
    toKrwAmount,
    reset: resetAmount,
  } = useAmountInput({
    exchangeRate,
    initialCurrencyType:
      isForeignCurrency && showLocalCurrency ? "LOCAL" : "KRW",
  });

  const [name, setName] = useState("");
  const [selectedSchedule, setSelectedSchedule] =
    useState<SelectedScheduleInfo | null>(
      scheduleId && scheduleName
        ? { id: scheduleId, name: scheduleName }
        : null,
    );
  const [isSelectScheduleOpen, setIsSelectScheduleOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSave = () => {
    const parsedName = name.trim();
    if (parsedName && isValidAmount) {
      onSaveExpense(parsedName, toKrwAmount(), selectedSchedule?.id);
      setName("");
      resetAmount();
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    resetAmount();
    onClose();
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule({
      id: schedule.id,
      name: schedule.place_name,
    });
  };

  const isCanSaveExpense = name.trim() && isValidAmount;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="경비 추가"
        primaryButton={{
          onClick: handleSave,
          disabled: !isCanSaveExpense,
        }}
        secondaryButton={{
          onClick: handleClose,
        }}
      >
        <VStack gap={3} w="full" px={4}>
          {/* 일정 정보 표시 */}
          {selectedSchedule && (
            <Box
              w="full"
              p={2}
              bg={`${colors.primary.palette}.50`}
              borderRadius="lg"
              borderLeft="4px solid"
              borderColor={colors.primary.palette}
              cursor={scheduleId ? "default" : "pointer"}
              onClick={() => !scheduleId && setIsSelectScheduleOpen(true)}
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
                {!scheduleId && (
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    변경
                  </Text>
                )}
              </HStack>
            </Box>
          )}

          <VStack gap={2} w="full">
            <HStack justify="flex-end" align="center" w="full">
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
              ref={nameInputRef}
              placeholder="예) 조식"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="lg"
              borderRadius="xl"
            />
          </VStack>

          <VStack gap={2} w="full">
            <HStack w="full" justify="space-between" align="center">
              <HStack gap={2} align="center">
                <Text fontSize="md" fontWeight="medium">
                  금액
                </Text>
                {estimatedKrw && (
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    ≈ {estimatedKrw}원
                  </Text>
                )}
              </HStack>
              {isForeignCurrency && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="teal"
                  h="24px"
                  px={2}
                  pb={0}
                  onClick={toggleCurrencyType}
                >
                  <HStack gap={1}>
                    <ArrowLeftRight size={12} />
                    <Text fontSize="xs">
                      {currencyType === "KRW"
                        ? "현지화로 입력하기"
                        : "원화로 입력하기"}
                    </Text>
                  </HStack>
                </Button>
              )}
            </HStack>

            <Box w="full" position="relative">
              <Input
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                inputMode="numeric"
                size="lg"
                borderRadius="xl"
                pl={currencyType === "LOCAL" ? "2rem" : "1rem"}
                pr="2.5rem"
              />

              {currencyType === "LOCAL" && (
                <Text
                  position="absolute"
                  left="1rem"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.500"
                  fontWeight="medium"
                >
                  {currencySymbol}
                </Text>
              )}
              <Text
                position="absolute"
                right="1rem"
                top="50%"
                transform="translateY(-50%)"
                color="gray.500"
                fontWeight="medium"
              >
                {currencyType === "KRW" ? "원" : ""}
              </Text>
            </Box>
          </VStack>
        </VStack>
      </BottomSheet>

      <SelectScheduleSheet
        isOpen={isSelectScheduleOpen}
        onClose={() => setIsSelectScheduleOpen(false)}
        tripId={tripId}
        onSelect={handleSelectSchedule}
        onUnlink={() => setSelectedSchedule(null)}
        selectedScheduleId={selectedSchedule?.id}
        selectedDate={date}
      />
    </>
  );
}
