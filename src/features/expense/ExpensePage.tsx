import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Box, Text, HStack, IconButton, useDisclosure } from "@chakra-ui/react";
import { Share2, Settings, Calculator } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import PullToRefresh from "@/shared/components/PullToRefresh";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import { formatTripDateRange } from "@/shared/utiles/date";
import FloatingAddButton from "@/shared/components/FloatingAddButton";
import { ScrollToTopButton } from "@/shared/components";
import { useScrollToTop, useToday } from "@/shared/hooks";
import { TripSettingsPanel } from "@/features/trip-settings";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { useTripGoneRedirect } from "@/shared/hooks/useTripGoneRedirect";
import { useTripSchedules } from "@/features/schedule/services/useTripSchedules";
import { DateTabList, ExpenseContent, AddExpenseSheet } from "./components";
import { useTripExpenses, useCreateExpense } from "./services";
import { useShareExpense } from "./hooks";
import type { ExpenseSaveOptions } from "./components/AddExpenseSheet";

const ALL_TAB_VALUE = "all";

export default function ExpensePage() {
  const { tripId } = useParams({ from: "/expense/$tripId" });
  const navigate = useNavigate();
  const { data: tripInfo } = useTripInfo(tripId);
  useTripGoneRedirect(tripId, tripInfo);
  const { data: expenses } = useTripExpenses(tripId);
  const { data: schedules } = useTripSchedules(tripId);
  const createExpenseMutation = useCreateExpense(tripId || "", {
    onSuccess: () => setIsSheetOpen(false),
  });

  // 사용자가 탭을 고르기 전에는 null — 아래에서 기본 탭을 정한다
  const [pickedDate, setSelectedDate] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const queryClient = useQueryClient();
  // 동행이 방금 적은 경비·일정·멤버까지 이 여행의 쿼리를 모두 새로 받는다
  const handleRefresh = useCallback(
    () =>
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[1] === tripId,
      }),
    [queryClient, tripId],
  );
  const settingsDrawer = useDisclosure();

  const dateList = useMemo(() => {
    if (!tripInfo) return [];

    const dates: Array<{ date: string; label: string; dayNumber: number }> = [];
    const startDate = dayjs(tripInfo.startDate);
    const endDate = dayjs(tripInfo.endDate);
    const daysDiff = endDate.diff(startDate, "day");

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = startDate.add(i, "day");
      dates.push({
        date: currentDate.format("YYYY-MM-DD"),
        label: currentDate.format("MM-DD"),
        dayNumber: i + 1,
      });
    }

    return dates;
  }, [tripInfo]);

  // 여행 기간이면 오늘 탭으로 연다 — + 버튼이 날짜 탭에만 있어서 바로 적을 수 있게
  const today = useToday();
  const selectedDate =
    pickedDate ??
    (dateList.some((d) => d.date === today) ? today : ALL_TAB_VALUE);

  // 일정 ID → 장소명 매핑
  const scheduleMap = useMemo(() => {
    const map = new Map<string, string>();
    (schedules || []).forEach((s) => map.set(s.id, s.place_name));
    return map;
  }, [schedules]);

  // 날짜별 경비 데이터 생성
  const dayExpenses = useMemo(() => {
    return dateList.map((dateItem) => {
      const dayExpenseItems = (expenses || [])
        .filter(
          (expense) =>
            dayjs(expense.expense_date).format("YYYY-MM-DD") === dateItem.date,
        )
        .map((expense) => ({
          id: expense.id,
          name: expense.expense_category,
          amount: expense.amount,
          memo: expense.notes,
          scheduleId: expense.schedule_id,
          scheduleName: expense.schedule_id
            ? (scheduleMap.get(expense.schedule_id) ?? null)
            : null,
          isPersonal: expense.is_personal,
          createdByUserId: expense.created_by,
        }));

      return {
        date: dateItem.date,
        label: dateItem.label,
        dayNumber: dateItem.dayNumber,
        expenses: dayExpenseItems,
      };
    });
  }, [dateList, expenses, scheduleMap]);

  const { handleShareExpense } = useShareExpense({ tripInfo, dayExpenses });

  const handleAddExpense = () => {
    setIsSheetOpen(true);
  };

  if (!tripInfo) return null;

  const handleSaveExpense = async (
    name: string,
    amount: number,
    scheduleId?: string,
    options?: ExpenseSaveOptions,
  ) => {
    if (!tripId) return;

    const selectedDateItem = dateList.find((d) => d.date === selectedDate);
    if (!selectedDateItem) return;

    return createExpenseMutation.mutateAsync({
      tripId,
      expenseDate: selectedDate,
      dayNumber: selectedDateItem.dayNumber,
      category: name,
      amount,
      memo: options?.memo,
      scheduleId,
      isPersonal: options?.isPersonal,
    });
  };

  return (
    <PageLayout style={{ paddingBottom: "60px" }}>
      <TripInfoHeader
        title={tripInfo.title || "가계부"}
        subTitle={formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
        rightAction={
          <HStack gap={0}>
            <IconButton
              aria-label="정산하기"
              variant="ghost"
              size="sm"
              color="gray.600"
              onClick={() =>
                navigate({
                  to: "/expense/settlement/$tripId",
                  params: { tripId },
                })
              }
            >
              <Calculator size={20} />
            </IconButton>
            <IconButton
              aria-label="공유하기"
              variant="ghost"
              size="sm"
              color="gray.600"
              onClick={handleShareExpense}
            >
              <Share2 size={20} />
            </IconButton>
            <IconButton
              aria-label="여행 설정"
              variant="ghost"
              size="sm"
              onClick={settingsDrawer.onOpen}
              color="gray.600"
            >
              <Settings size={20} />
            </IconButton>
          </HStack>
        }
      />

      {dateList.length > 0 ? (
        <PullToRefresh onRefresh={handleRefresh}>
          <DateTabList
            dateList={dateList}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          <ExpenseContent
            selectedDate={selectedDate}
            dayExpenses={dayExpenses}
            isAllTab={selectedDate === ALL_TAB_VALUE}
            tripId={tripId}
          />
        </PullToRefresh>
      ) : (
        <Box
          p={8}
          textAlign="center"
          color="gray.500"
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="md"
          mx={4}
        >
          <Text>여행 날짜 정보가 없습니다.</Text>
        </Box>
      )}

      {selectedDate !== ALL_TAB_VALUE && (
        <FloatingAddButton
          onClick={handleAddExpense}
          ariaLabel="경비 추가"
          topSlot={
            showScrollTop ? (
              <ScrollToTopButton onClick={scrollToTop} />
            ) : undefined
          }
        />
      )}

      <AddExpenseSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSaveExpense={handleSaveExpense}
        date={selectedDate}
        tripId={tripId}
      />

      <TripSettingsPanel
        isOpen={settingsDrawer.open}
        onClose={settingsDrawer.onClose}
        tripId={tripId}
      />
    </PageLayout>
  );
}
