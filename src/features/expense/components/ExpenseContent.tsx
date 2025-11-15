import { Box, Container } from "@chakra-ui/react";
import ExpenseAllContent from "./ExpenseAllContent";
import ExpenseList from "./ExpenseList";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface DayExpense {
  date: string;
  label: string;
  dayNumber: number;
  expenses: ExpenseItem[];
}

interface ExpenseContentProps {
  selectedDate: string;
  dayExpenses: DayExpense[];
  isAllTab: boolean;
}

/**
 * 경비 컨텐츠 영역
 * - 전체 탭: 타임라인 스크롤 방식
 * - 특정 날짜 탭: 해당 날짜의 경비만 표시
 */
export default function ExpenseContent({
  selectedDate,
  dayExpenses,
  isAllTab,
}: ExpenseContentProps) {
  return (
    <Container maxW="6xl" pt={4} pb={6} px={1}>
      {isAllTab ? (
        // 전체 탭 - 타임라인 스크롤 방식
        <ExpenseAllContent dayExpenses={dayExpenses} />
      ) : (
        // 특정 날짜 탭 - 해당 날짜의 경비만 표시
        dayExpenses
          .filter((day) => day.date === selectedDate)
          .map((day) => (
            <Box key={day.date}>
              <ExpenseList expenses={day.expenses} />
            </Box>
          ))
      )}
    </Container>
  );
}

