import { VStack } from "@chakra-ui/react";
import ExpenseSummaryCard from "./ExpenseSummaryCard";
import ExpenseDaySection from "./ExpenseDaySection";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  scheduleId?: string | null;
}

interface DayExpense {
  date: string;
  label: string;
  dayNumber: number;
  expenses: ExpenseItem[];
}

interface ExpenseAllContentProps {
  dayExpenses: DayExpense[];
  tripId: string;
}

export default function ExpenseAllContent({
  dayExpenses,
  tripId,
}: ExpenseAllContentProps) {
  const totalAmount = dayExpenses.reduce(
    (sum, day) =>
      sum +
      day.expenses.reduce((daySum, expense) => daySum + expense.amount, 0),
    0
  );

  const averagePerDay =
    dayExpenses.length > 0 ? Math.round(totalAmount / dayExpenses.length) : 0;

  const dayAmounts = dayExpenses.map((day) => ({
    date: day.label,
    amount: day.expenses.reduce((sum, expense) => sum + expense.amount, 0),
  }));

  const maxDay = dayAmounts.reduce(
    (max, day) => (day.amount > max.amount ? day : max),
    { date: "", amount: 0 }
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
        <ExpenseDaySection
          key={day.date}
          dayNumber={day.dayNumber}
          date={day.label}
          expenses={day.expenses}
          tripId={tripId}
          readOnly
        />
      ))}
    </VStack>
  );
}
