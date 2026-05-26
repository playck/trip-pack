import { useState, useCallback, useEffect } from "react";
import { Link2 } from "lucide-react";
import { useAtomValue } from "jotai";
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
import type { Schedule } from "@/features/schedule/types";
import { useTripCurrency } from "../hooks/useTripCurrency";
import { useAmountInput } from "../hooks/useAmountInput";
import { showLocalCurrencyAtom } from "../store/currencyStore";
import type { ExpenseCategoryDef } from "../constants/categories";
import ExpenseCategoryChips from "./ExpenseCategoryChips";
import SelectScheduleSheet from "./SelectScheduleSheet";
import {
  AmountCalculatorProvider,
  AmountCalculatorDisplay,
  AmountCalculatorKeypad,
} from "./calculator/AmountCalculator";

export interface ExpenseSaveOptions {
  isPersonal: boolean;
  memo: string | null;
}

interface AddExpenseSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (
    name: string,
    amount: number,
    scheduleId?: string,
    options?: ExpenseSaveOptions,
  ) => void;
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
    isValidAmount,
    currencyType,
    toggleCurrencyType,
    estimatedKrw,
    toKrwAmount,
    setAmountFromNumber,
    reset: resetAmount,
  } = useAmountInput({
    exchangeRate,
    initialCurrencyType:
      isForeignCurrency && showLocalCurrency ? "LOCAL" : "KRW",
  });

  const handleAmountFromCalculator = useCallback(
    (value: number) => {
      setAmountFromNumber(value);
    },
    [setAmountFromNumber],
  );

  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategoryDef | null>(null);
  const [memo, setMemo] = useState("");
  const [isPersonal, setIsPersonal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<SelectedScheduleInfo | null>(
      scheduleId && scheduleName
        ? { id: scheduleId, name: scheduleName }
        : null,
    );
  const [isSelectScheduleOpen, setIsSelectScheduleOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(null);
      setMemo("");
      setIsPersonal(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (selectedCategory && isValidAmount) {
      const trimmedMemo = memo.trim();
      const options: ExpenseSaveOptions = {
        isPersonal,
        memo: trimmedMemo ? trimmedMemo : null,
      };
      onSaveExpense(
        selectedCategory.label,
        toKrwAmount(),
        selectedSchedule?.id,
        options,
      );
      setSelectedCategory(null);
      setMemo("");
      setIsPersonal(false);
      resetAmount();
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setMemo("");
    setIsPersonal(false);
    resetAmount();
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
        title="경비 추가"
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
          currencySymbol={currencySymbol}
          currencyType={currencyType}
          estimatedKrw={estimatedKrw}
          isForeignCurrency={isForeignCurrency}
          onToggleCurrency={toggleCurrencyType}
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
                  cursor={scheduleId ? "default" : "pointer"}
                  onClick={() => !scheduleId && setIsSelectScheduleOpen(true)}
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
        tripId={tripId}
        onSelect={handleSelectSchedule}
        onUnlink={() => setSelectedSchedule(null)}
        selectedScheduleId={selectedSchedule?.id}
        selectedDate={date}
      />
    </>
  );
}
