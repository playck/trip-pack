import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link2, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Box,
  Switch,
} from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import type { Schedule } from "@/features/schedule/types";
import { useAuth } from "@/shared/hooks/useAuth";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";
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
  initialIsShared?: boolean;
  initialPaidByUserId?: string | null;
  initialSplitMemberIds?: string[];
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
  initialIsShared = true,
  initialPaidByUserId,
  initialSplitMemberIds = [],
  tripId,
  selectedDate,
}: EditExpenseSheetProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategoryDef | null>(null);
  const [legacyLabel, setLegacyLabel] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const { parsedAmount, isValidAmount, setAmountFromNumber } = useAmountInput();
  const [calculatorInitialValue, setCalculatorInitialValue] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const { user } = useAuth();
  const { data: members = [] } = useTripMembers(tripId);
  const hasMultipleMembers = members.length >= 2;

  const currentMember = useMemo(
    () => members.find((m) => m.user_id === user?.id),
    [members, user?.id],
  );

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

  // 공유 관련 상태
  const [isShared, setIsShared] = useState(true);
  const [paidByUserId, setPaidByUserId] = useState<string | null>(null);
  const [selectedSplitMemberIds, setSelectedSplitMemberIds] = useState<
    string[]
  >([]);
  const [isSplitSelectOpen, setIsSplitSelectOpen] = useState(false);

  const { data: schedules } = useTripSchedules(tripId);

  // 백그라운드 refetch로 인한 폼 입력 손실 방지: 외부 값은 ref로 추적
  const schedulesRef = useRef(schedules);
  const membersRef = useRef(members);
  const userIdRef = useRef(user?.id);
  schedulesRef.current = schedules;
  membersRef.current = members;
  userIdRef.current = user?.id;

  const splitMembersKey = initialSplitMemberIds.join(",");

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

      // 공유 상태 초기화
      setIsShared(initialIsShared);
      setPaidByUserId(initialPaidByUserId ?? userIdRef.current ?? null);
      setSelectedSplitMemberIds(
        initialSplitMemberIds.length > 0
          ? initialSplitMemberIds
          : membersRef.current.map((m) => m.id),
      );
      setIsSplitSelectOpen(false);
    }
    // initialSplitMemberIds는 splitMembersKey로 안정화하여 새 배열 ref 무시
    // schedules, members, user는 ref로 처리하여 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    initialName,
    initialAmount,
    initialMemo,
    initialScheduleId,
    initialIsShared,
    initialPaidByUserId,
    splitMembersKey,
  ]);

  const handleSave = () => {
    if (selectedCategory && isValidAmount) {
      const trimmedMemo = memo.trim();
      const options: ExpenseSaveOptions = {
        isShared: hasMultipleMembers ? isShared : false,
        paidBy:
          hasMultipleMembers && isShared ? paidByUserId : (user?.id ?? null),
        splitMemberIds:
          hasMultipleMembers && isShared ? selectedSplitMemberIds : [],
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
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setLegacyLabel(null);
    setMemo("");
    onClose();
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule({
      id: schedule.id,
      name: schedule.place_name,
    });
  };

  const handleToggleSplitMember = (memberId: string) => {
    setSelectedSplitMemberIds((prev) => {
      if (prev.includes(memberId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const getMemberDisplayName = (member: (typeof members)[0]) =>
    member.user_id === user?.id
      ? "나"
      : member.profiles?.username || member.profiles?.email || "알 수 없음";

  const splitSelectLabel = useMemo(() => {
    if (selectedSplitMemberIds.length === members.length) return "전체";
    if (selectedSplitMemberIds.length === 0) return "선택 없음";
    const selectedNames = members
      .filter((m) => selectedSplitMemberIds.includes(m.id))
      .map(getMemberDisplayName);
    return selectedNames.join(", ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSplitMemberIds, members, user?.id]);

  const isCanSaveExpense =
    !!selectedCategory &&
    isValidAmount &&
    !isCalculating &&
    (!hasMultipleMembers || !isShared || selectedSplitMemberIds.length > 0);

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

          {/* 공유 설정 (멤버 2명 이상일 때만) */}
          {hasMultipleMembers && (
            <VStack gap={3} w="full" pt={1}>
              {/* 공유 토글 */}
              <HStack justify="space-between" w="full" py={1}>
                <Text fontSize="md" fontWeight="medium">
                  일행과 공유
                </Text>
                <Switch.Root
                  checked={isShared}
                  onCheckedChange={(e) => setIsShared(e.checked)}
                  colorPalette={colors.primary.palette}
                >
                  <Switch.HiddenInput />
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Root>
              </HStack>

              {isShared && (
                <>
                  {/* 결제자 선택 */}
                  <VStack gap={2} w="full" align="start">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      결제자
                    </Text>
                    <HStack gap={2} flexWrap="wrap" w="full">
                      {members.map((member) => {
                        const isSelected = member.user_id === paidByUserId;
                        return (
                          <Box
                            key={member.id}
                            as="button"
                            px={3}
                            py={1.5}
                            bg={
                              isSelected
                                ? `${colors.primary.palette}.500`
                                : "gray.100"
                            }
                            color={isSelected ? "white" : "gray.600"}
                            borderRadius="full"
                            fontSize="sm"
                            fontWeight="medium"
                            cursor="pointer"
                            transition="all 0.2s"
                            onClick={() => setPaidByUserId(member.user_id)}
                          >
                            {getMemberDisplayName(member)}
                          </Box>
                        );
                      })}
                    </HStack>
                  </VStack>

                  {/* 정산 대상자 Select */}
                  <VStack gap={2} w="full" align="start">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600">
                      정산 대상 ({selectedSplitMemberIds.length}/
                      {members.length}
                      명)
                    </Text>
                    <Box
                      as="button"
                      w="full"
                      px={3}
                      py={2}
                      bg="gray.50"
                      border="1px solid"
                      borderColor={
                        isSplitSelectOpen
                          ? `${colors.primary.palette}.300`
                          : "gray.200"
                      }
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => setIsSplitSelectOpen(!isSplitSelectOpen)}
                      transition="all 0.2s"
                    >
                      <HStack justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.700">
                          {splitSelectLabel}
                        </Text>
                        <Box
                          transition="transform 0.2s"
                          transform={
                            isSplitSelectOpen ? "rotate(180deg)" : undefined
                          }
                        >
                          <ChevronDown size={16} color="gray" />
                        </Box>
                      </HStack>
                    </Box>
                    {isSplitSelectOpen && (
                      <Box
                        w="full"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        overflow="hidden"
                        px={2}
                        py={1}
                      >
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {members.map((member) => (
                            <Checkbox
                              key={member.id}
                              isChecked={selectedSplitMemberIds.includes(
                                member.id,
                              )}
                              onChange={() =>
                                handleToggleSplitMember(member.id)
                              }
                              label={getMemberDisplayName(member)}
                            />
                          ))}
                        </Box>
                        <HStack
                          gap={2}
                          w="full"
                          justify="flex-end"
                          px={2}
                          py={1}
                          borderTop="1px solid"
                          borderColor="gray.100"
                        >
                          <Button
                            size="xs"
                            variant="ghost"
                            color="gray.500"
                            h="24px"
                            px={2}
                            onClick={() =>
                              setSelectedSplitMemberIds(
                                members.map((m) => m.id),
                              )
                            }
                          >
                            전체 선택
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            color="gray.500"
                            h="24px"
                            px={2}
                            onClick={() => {
                              if (currentMember) {
                                setSelectedSplitMemberIds([currentMember.id]);
                              }
                            }}
                          >
                            전체 해제
                          </Button>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </>
              )}
            </VStack>
          )}

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
