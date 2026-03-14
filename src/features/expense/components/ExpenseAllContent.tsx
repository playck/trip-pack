import { Box, VStack } from "@chakra-ui/react";
import type { DayExpense } from "../types";
import ExpenseSummaryCard from "./ExpenseSummaryCard";
import ExpenseDaySection from "./ExpenseDaySection";

interface ExpenseAllContentProps {
  dayExpenses: DayExpense[];
  tripId: string;
  totalMemberCount?: number;
}

export default function ExpenseAllContent({
  dayExpenses,
  tripId,
  totalMemberCount = 0,
}: ExpenseAllContentProps) {
  const totalAmount = dayExpenses.reduce(
    (sum, day) =>
      sum +
      day.expenses.reduce((daySum, expense) => daySum + expense.amount, 0),
    0,
  );

  const averagePerDay =
    dayExpenses.length > 0
      ? Math.round(totalAmount / dayExpenses.length)
      : 0;

  const dayAmounts = dayExpenses.map((day) => ({
    date: day.label,
    amount: day.expenses.reduce((sum, expense) => sum + expense.amount, 0),
  }));

  const maxDay = dayAmounts.reduce(
    (max, day) => (day.amount > max.amount ? day : max),
    { date: "", amount: 0 },
  );

  return (
    <VStack align="stretch" gap={3} pb="70px">
      <ExpenseSummaryCard
        totalAmount={totalAmount}
        averagePerDay={averagePerDay}
        maxDayAmount={maxDay.amount}
        maxDayDate={maxDay.date}
        tripId={tripId}
      />

      {dayExpenses.map((day) => (
        <Box
          key={day.date}
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: "auto 150px",
          }}
        >
          <ExpenseDaySection
            dayNumber={day.dayNumber}
            date={day.label}
            expenses={day.expenses}
            tripId={tripId}
            readOnly
            totalMemberCount={totalMemberCount}
          />
        </Box>
      ))}
    </VStack>
  );
}
