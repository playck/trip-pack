import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "@tanstack/react-router";
import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { Share2 } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import TripInfoHeader from "@/shared/components/layout/TripInfoHeader";
import { formatTripDateRange } from "@/shared/utiles/date";
import { TripActionMenu } from "@/shared/components";
import FloatingAddButton from "@/shared/components/FloatingAddButton";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { DateTabList, ExpenseContent, AddExpenseSheet } from "./components";
import { useTripExpenses, useCreateExpense } from "./services";
import { useShareExpense } from "./hooks";

const ALL_TAB_VALUE = "all";

export default function ExpensePage() {
  const { tripId } = useParams({ from: "/expense/$tripId" });
  const { data: tripInfo } = useTripInfo(tripId);
  const { data: expenses } = useTripExpenses(tripId);
  const createExpenseMutation = useCreateExpense(tripId || "", {
    onSuccess: () => setIsSheetOpen(false),
  });

  const [selectedDate, setSelectedDate] = useState<string>(ALL_TAB_VALUE);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  // 날짜별 경비 데이터 생성
  const dayExpenses = useMemo(() => {
    return dateList.map((dateItem) => {
      // 해당 날짜의 경비만 필터링
      const dayExpenseItems = (expenses || [])
        .filter((expense) => expense.expense_date === dateItem.date)
        .map((expense) => ({
          id: expense.id,
          name: expense.expense_category,
          amount: expense.amount,
        }));

      return {
        date: dateItem.date,
        label: dateItem.label,
        dayNumber: dateItem.dayNumber,
        expenses: dayExpenseItems,
      };
    });
  }, [dateList, expenses]);

  const { handleShareExpense } = useShareExpense({ tripInfo, dayExpenses });

  const handleAddExpense = () => {
    setIsSheetOpen(true);
  };

  const handleSaveExpense = (
    name: string,
    amount: number,
    scheduleId?: string
  ) => {
    if (!tripId) return;

    const selectedDateItem = dateList.find((d) => d.date === selectedDate);
    if (!selectedDateItem) return;

    createExpenseMutation.mutate({
      tripId,
      expenseDate: selectedDate,
      dayNumber: selectedDateItem.dayNumber,
      category: name,
      amount,
      scheduleId,
    });
  };

  if (!tripInfo) return null;

  return (
    <PageLayout style={{ paddingBottom: "60px" }}>
      <TripInfoHeader
        title={tripInfo.title || "가계부"}
        subTitle={formatTripDateRange(tripInfo.startDate, tripInfo.endDate)}
        rightAction={
          <HStack gap={0}>
            <IconButton
              aria-label="공유하기"
              variant="ghost"
              size="sm"
              color="gray.600"
              onClick={handleShareExpense}
            >
              <Share2 size={20} />
            </IconButton>
            <TripActionMenu
              tripId={tripId}
              tripTitle={tripInfo.title || "여행"}
            />
          </HStack>
        }
      />

      {dateList.length > 0 ? (
        <>
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
        </>
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
        <FloatingAddButton onClick={handleAddExpense} ariaLabel="경비 추가" />
      )}

      <AddExpenseSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSaveExpense={handleSaveExpense}
        date={dateList.find((d) => d.date === selectedDate)?.label}
        tripId={tripId}
      />
    </PageLayout>
  );
}
