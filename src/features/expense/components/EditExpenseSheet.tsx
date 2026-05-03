import { useState, useEffect, useCallback, useMemo } from "react";
import { Link2, ChevronDown } from "lucide-react";
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
import SelectScheduleSheet from "./SelectScheduleSheet";
import AmountCalculator from "./calculator/AmountCalculator";
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
  initialScheduleId,
  initialIsShared = true,
  initialPaidByUserId,
  initialSplitMemberIds = [],
  tripId,
  selectedDate,
}: EditExpenseSheetProps) {
  const [name, setName] = useState("");
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

      // 공유 상태 초기화
      setIsShared(initialIsShared);
      setPaidByUserId(initialPaidByUserId ?? user?.id ?? null);
      setSelectedSplitMemberIds(
        initialSplitMemberIds.length > 0
          ? initialSplitMemberIds
          : members.map((m) => m.id),
      );
      setIsSplitSelectOpen(false);
    }
  }, [
    isOpen,
    initialName,
    initialAmount,
    initialScheduleId,
    initialIsShared,
    initialPaidByUserId,
    initialSplitMemberIds,
    schedules,
    user?.id,
    members,
  ]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName && isValidAmount) {
      const options: ExpenseSaveOptions = {
        isShared: hasMultipleMembers ? isShared : false,
        paidBy:
          hasMultipleMembers && isShared ? paidByUserId : (user?.id ?? null),
        splitMemberIds:
          hasMultipleMembers && isShared ? selectedSplitMemberIds : [],
      };
      onSaveExpense(
        trimmedName,
        parsedAmount,
        selectedSchedule?.id ?? null,
        options,
      );
    }
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
    name.trim() &&
    isValidAmount &&
    !isCalculating &&
    (!hasMultipleMembers || !isShared || selectedSplitMemberIds.length > 0);

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
