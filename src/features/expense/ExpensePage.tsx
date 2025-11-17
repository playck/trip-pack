import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "@tanstack/react-router";
import { Box, Text } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import FloatingAddButton from "@/shared/components/FloatingAddButton";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { DateTabList, ExpenseContent, AddExpenseSheet } from "./components";
import { useTripExpenses } from "./hooks/useTripExpenses";
import { useCreateExpense } from "./hooks/useCreateExpense";

const ALL_TAB_VALUE = "all";

export default function ExpensePage() {
  const { tripId } = useParams({ from: "/expense/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);
  const { data: expenses, isLoading: isLoadingExpenses } =
    useTripExpenses(tripId);
  const createExpenseMutation = useCreateExpense(tripId || "", {
    onSuccess: () => setIsSheetOpen(false),
  });
  const [selectedDate, setSelectedDate] = useState<string>(ALL_TAB_VALUE);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 여행 기간의 날짜 생성
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
        label: currentDate.format("M-D"),
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

  const handleAddExpense = () => {
    setIsSheetOpen(true);
  };

  const handleSaveExpense = (
    name: string,
    amount: number,
    scheduleId?: string
  ) => {
    if (!tripId) return;

    // 선택된 날짜에 해당하는 dayNumber 찾기
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

  if (isLoading || isLoadingExpenses) {
    return (
      <PageLayout>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error || !tripInfo) {
    return (
      <PageLayout>
        <Box p={4}>
          <Text color="red.500">여행 정보를 불러올 수 없습니다.</Text>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* <Container maxW="6xl" py={3} px={4}>
        <Heading size="lg">{tripInfo.title}</Heading>
      </Container> */}

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
      />
    </PageLayout>
  );
}
