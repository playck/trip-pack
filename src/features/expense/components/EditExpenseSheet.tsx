import { useState, useEffect, useCallback, useRef } from "react";
import { Link2, MoreHorizontal } from "lucide-react";
import {
  VStack,
  HStack,
  Input,
  Text,
  Box,
  Switch,
} from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import type { Schedule } from "@/features/schedule/types";
import { useAmountInput } from "../hooks/useAmountInput";
import {
  findCategoryByLabel,
  type ExpenseCategoryDef,
} from "../constants/categories";
import ExpenseCategoryChips from "./ExpenseCategoryChips";
import SelectScheduleSheet from "./SelectScheduleSheet";
import {
  AmountCalculatorProvider,
  AmountCalculatorDisplay,
  AmountCalculatorKeypad,
} from "./calculator/AmountCalculator";
import type { ExpenseSaveOptions } from "./AddExpenseSheet";

interface EditExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (
    name: string,
    amount: number,
    scheduleId?: string | null,
    options?: ExpenseSaveOptions,
  ) => void;
  initialName: string;
  initialAmount: number;
  initialMemo?: string | null;
  initialScheduleId?: string | null;
  initialIsPersonal?: boolean;
  tripId: string;
  selectedDate?: string;
}

export default function EditExpenseSheet({
  isOpen,
  onClose,
  onSaveExpense,
  initialName,
  initialAmount,
  initialMemo,
  initialScheduleId,
  initialIsPersonal = false,
  tripId,
  selectedDate,
}: EditExpenseSheetProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategoryDef | null>(null);
  const [legacyLabel, setLegacyLabel] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [isPersonal, setIsPersonal] = useState(false);
  const { parsedAmount, isValidAmount, setAmountFromNumber } = useAmountInput();
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
  const schedulesRef = useRef(schedules);
  schedulesRef.current = schedules;

  useEffect(() => {
    if (isOpen) {
      const trimmedName = initialName.trim();
      const matched = findCategoryByLabel(trimmedName);
      if (matched) {
        setSelectedCategory(matched);
        setLegacyLabel(null);
      } else if (trimmedName) {
        setLegacyLabel(trimmedName);
        setSelectedCategory({
          id: "legacy",
          label: trimmedName,
          icon: MoreHorizontal,
          color: "gray",
        });
      } else {
        setSelectedCategory(null);
        setLegacyLabel(null);
      }
      setMemo(initialMemo ?? "");
      setIsPersonal(initialIsPersonal);
      setCalculatorInitialValue(initialAmount);

      if (initialScheduleId) {
        const scheduleName = schedulesRef.current?.find(
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
  }, [
    isOpen,
    initialName,
    initialAmount,
    initialMemo,
    initialScheduleId,
    initialIsPersonal,
  ]);

  const handleSave = () => {
    if (selectedCategory && isValidAmount) {
      const trimmedMemo = memo.trim();
      const options: ExpenseSaveOptions = {
        isPersonal,
        memo: trimmedMemo ? trimmedMemo : null,
      };
      onSaveExpense(
        selectedCategory.label,
        parsedAmount,
        selectedSchedule?.id ?? null,
        options,
      );
      setSelectedCategory(null);
      setLegacyLabel(null);
      setMemo("");
      setIsPersonal(false);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setLegacyLabel(null);
    setMemo("");
    setIsPersonal(false);
    onClose();
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule({
      id: schedule.id,
      name: schedule.place_name,
    });
  };

  const isCanSaveExpense =
    !!selectedCategory && isValidAmount && !isCalculating;

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title="경비 수정"
        size="fullscreen"
        primaryButton={{
          onClick: handleSave,
          disabled: !isCanSaveExpense,
        }}
        secondaryButton={{
          onClick: handleClose,
        }}
      >
        <AmountCalculatorProvider
          onAmountChange={handleAmountFromCalculator}
          onCalculatingChange={setIsCalculating}
          initialValue={calculatorInitialValue}
        >
          <VStack gap={3} w="full" px={4} pt={1} pb={4} align="stretch">
            {/* 일정 연동 (우측 컴팩트 칩) */}
            <HStack justify="flex-end" w="full">
              {selectedSchedule ? (
                <Box
                  as="button"
                  bg={`${colors.primary.palette}.50`}
                  border="1px solid"
                  borderColor={`${colors.primary.palette}.200`}
                  borderRadius="full"
                  px={3}
                  py={1.5}
                  cursor="pointer"
                  onClick={() => setIsSelectScheduleOpen(true)}
                  maxW="full"
                >
                  <HStack gap={1} minW={0}>
                    <Link2
                      size={12}
                      color={`var(--chakra-colors-${colors.primary.palette}-600)`}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color={`${colors.primary.palette}.700`}
                      lineClamp={1}
                    >
                      {selectedSchedule.name}
                    </Text>
                  </HStack>
                </Box>
              ) : (
                <Box
                  as="button"
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="full"
                  px={3}
                  py={1.5}
                  cursor="pointer"
                  onClick={() => setIsSelectScheduleOpen(true)}
                  _hover={{
                    borderColor: `${colors.primary.palette}.400`,
                    bg: `${colors.primary.palette}.50`,
                  }}
                  transition="all 0.15s"
                >
                  <HStack gap={1}>
                    <Link2 size={12} color="var(--chakra-colors-gray-500)" />
                    <Text fontSize="xs" fontWeight="medium" color="gray.600">
                      일정 연결하기
                    </Text>
                  </HStack>
                </Box>
              )}
            </HStack>

            <VStack gap={3} w="full" align="stretch">
              <ExpenseCategoryChips
                selectedLabel={selectedCategory?.label ?? null}
                onSelect={setSelectedCategory}
                legacyLabel={legacyLabel}
              />
              <Input
                placeholder="메모 입력 (선택)"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onFocus={(e) =>
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
                size="md"
                borderRadius="xl"
              />
            </VStack>

            {/* 내 개인 경비 토글 (항상 노출) */}
            <Box
              border="1px solid"
              borderColor={
                isPersonal ? `${colors.primary.palette}.200` : "gray.200"
              }
              bg={isPersonal ? `${colors.primary.palette}.50` : "white"}
              borderRadius="xl"
              px={3}
              py={2}
              transition="all 0.15s"
            >
              <HStack justify="space-between" w="full">
                <VStack align="flex-start" gap={0}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.800">
                    내 개인 경비
                  </Text>
                  <Text fontSize="2xs" color="gray.500">
                    예산/정산 리포트에서 제외돼요
                  </Text>
                </VStack>
                <Switch.Root
                  checked={isPersonal}
                  onCheckedChange={(e) => setIsPersonal(e.checked)}
                  colorPalette={colors.primary.palette}
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </HStack>
            </Box>

            <AmountCalculatorDisplay />
            <AmountCalculatorKeypad />
          </VStack>
        </AmountCalculatorProvider>
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
