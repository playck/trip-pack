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
  tripId: string;
}

export default function ExpenseContent({
  selectedDate,
  dayExpenses,
  isAllTab,
  tripId,
}: ExpenseContentProps) {
  return (
    <Container maxW="6xl" pt={3} pb={6} px={1}>
      {isAllTab ? (
        <ExpenseAllContent dayExpenses={dayExpenses} tripId={tripId} />
      ) : (
        dayExpenses
          .filter((day) => day.date === selectedDate)
          .map((day) => (
            <Box key={day.date}>
              <ExpenseList expenses={day.expenses} tripId={tripId} />
            </Box>
          ))
      )}
    </Container>
  );
}
