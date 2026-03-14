import { Box, Container } from "@chakra-ui/react";
import type { DayExpense } from "../types";
import ExpenseAllContent from "./ExpenseAllContent";
import ExpenseList from "./ExpenseList";

interface ExpenseContentProps {
  selectedDate: string;
  dayExpenses: DayExpense[];
  isAllTab: boolean;
  tripId: string;
  totalMemberCount?: number;
}

export default function ExpenseContent({
  selectedDate,
  dayExpenses,
  isAllTab,
  tripId,
  totalMemberCount = 0,
}: ExpenseContentProps) {
  return (
    <Container maxW="6xl" pt={3} pb={6} px={1}>
      {isAllTab ? (
        <ExpenseAllContent
          dayExpenses={dayExpenses}
          tripId={tripId}
          totalMemberCount={totalMemberCount}
        />
      ) : (
        dayExpenses
          .filter((day) => day.date === selectedDate)
          .map((day) => (
            <Box key={day.date}>
              <ExpenseList
                expenses={day.expenses}
                tripId={tripId}
                selectedDate={selectedDate}
                totalMemberCount={totalMemberCount}
              />
            </Box>
          ))
      )}
    </Container>
  );
}
