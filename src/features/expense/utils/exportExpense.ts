import dayjs from "dayjs";

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

interface TripInfo {
  title: string | null;
  startDate: string;
  endDate: string;
}

export function formatAllExpensesToText(
  tripInfo: TripInfo,
  dayExpenses: DayExpense[]
): string {
  const title = tripInfo.title || "여행 가계부";
  const start = dayjs(tripInfo.startDate).format("YYYY.MM.DD");
  const end = dayjs(tripInfo.endDate).format("YYYY.MM.DD");
  const totalAmount = dayExpenses.reduce((sum, day) => {
    const dayTotal = day.expenses.reduce((dSum, item) => dSum + item.amount, 0);
    return sum + dayTotal;
  }, 0);

  const formattedTotal = totalAmount.toLocaleString();

  let text = `✈️ ${title}\n`;
  text += `📅 ${start} ~ ${end}\n\n`;
  text += `💰 총 지출: ${formattedTotal}원\n`;
  text += `━━━━━━━━━━━━━━\n`;

  dayExpenses.forEach((day) => {
    const dayTotal = day.expenses.reduce((sum, item) => sum + item.amount, 0);
    const dayLabel = dayjs(day.date).format("MM.DD (ddd)");

    text += `\n[Day ${day.dayNumber}] ${dayLabel}\n`;

    if (day.expenses.length === 0) {
      text += ` - 지출 내역 없음\n`;
    } else {
      day.expenses.forEach((item) => {
        text += ` • ${item.name}: ${item.amount.toLocaleString()}원\n`;
      });
      text += ` (소계: ${dayTotal.toLocaleString()}원)\n`;
    }
  });

  return text;
}
