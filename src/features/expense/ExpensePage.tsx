import { Container, Heading, Box, Text } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useParams } from "@tanstack/react-router";
import { useTripInfo } from "@/shared/hooks/useTripQuery";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { DateTabList } from "./components";

export default function ExpensePage() {
  const { tripId } = useParams({ from: "/expense/$tripId" });
  const { data: tripInfo, isLoading, error } = useTripInfo(tripId);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 여행 기간의 날짜 목록 생성
  const dateList = useMemo(() => {
    if (!tripInfo) return [];

    const dates: Array<{ date: string; label: string; dayNumber: number }> = [];
    const startDate = dayjs(tripInfo.startDate);
    const endDate = dayjs(tripInfo.endDate);
    const daysDiff = endDate.diff(startDate, "day");

    for (let i = 0; i <= daysDiff * 5; i++) {
      const currentDate = startDate.add(i, "day");
      dates.push({
        date: currentDate.format("YYYY-MM-DD"),
        label: currentDate.format("M-D"),
        dayNumber: i + 1,
      });
    }

    return dates;
  }, [tripInfo]);

  // 첫 번째 날짜를 기본값으로 설정
  useMemo(() => {
    if (dateList.length > 0 && !selectedDate) {
      setSelectedDate(dateList[0].date);
    }
  }, [dateList, selectedDate]);

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
      <Container maxW="6xl" py={3} px={4}>
        <Heading size="lg">{tripInfo.title}</Heading>
      </Container>

      {dateList.length > 0 ? (
        <>
          {/* 스크롤 가능한 가로 탭 */}
          <DateTabList
            dateList={dateList}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* 선택된 날짜의 컨텐츠 */}
          <Container maxW="6xl" pt={4} pb={6} px={4}>
            {dateList.map((dateItem) =>
              selectedDate === dateItem.date ? (
                <Box key={dateItem.date}>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Text color="gray.600" textAlign="center">
                      {dateItem.label} 경비 내역
                    </Text>
                    {/* 여기에 경비 목록이 들어갈 예정 */}
                  </Box>
                </Box>
              ) : null
            )}
          </Container>
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
