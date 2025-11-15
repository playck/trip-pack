import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "@tanstack/react-router";
import { Box, Text } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import { DateTabList, ExpenseContent } from "./components";

const ALL_TAB_VALUE = "all";

export default function ExpensePage() {
  const { tripId } = useParams({ from: "/expense/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);
  const [selectedDate, setSelectedDate] = useState<string>(ALL_TAB_VALUE);

  // 여행 기간의 날짜 목록 생성
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

  // 날짜별 샘플 경비 데이터 생성 (임시)
  const dayExpenses = useMemo(() => {
    return dateList.map((dateItem, index) => {
      // 각 날짜마다 랜덤하게 3-5개의 경비 항목 생성
      const itemCount = 3 + (index % 3);
      const expenseItems = [
        { id: `${index}-1`, name: "아침 식사", amount: 12000 + index * 1000 },
        { id: `${index}-2`, name: "점심 식사", amount: 20000 + index * 2000 },
        { id: `${index}-3`, name: "카페", amount: 7000 + index * 500 },
        { id: `${index}-4`, name: "저녁 식사", amount: 35000 + index * 3000 },
        { id: `${index}-5`, name: "교통비", amount: 10000 + index * 1000 },
      ].slice(0, itemCount);

      return {
        date: dateItem.date,
        label: dateItem.label,
        dayNumber: dateItem.dayNumber,
        expenses: expenseItems,
      };
    });
  }, [dateList]);

  if (isLoading) {
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
    </PageLayout>
  );
}
