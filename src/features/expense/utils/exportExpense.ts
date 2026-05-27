import dayjs from "dayjs";
import type { DayExpense, ExpenseItemData, TripBasicInfo } from "../types";

const isCommunal = (e: ExpenseItemData) => !e.isPersonal;

export function formatAllExpensesToText(
  tripInfo: TripBasicInfo,
  dayExpenses: DayExpense[]
): string {
  const title = tripInfo.title || "여행 가계부";
  const start = dayjs(tripInfo.startDate).format("YYYY.MM.DD");
  const end = dayjs(tripInfo.endDate).format("YYYY.MM.DD");

  const sumCommunal = (expenses: ExpenseItemData[]) =>
    expenses.filter(isCommunal).reduce((sum, item) => sum + item.amount, 0);

  const totalAmount = dayExpenses.reduce(
    (sum, day) => sum + sumCommunal(day.expenses),
    0,
  );

  const formattedTotal = totalAmount.toLocaleString();

  let text = `✈️ ${title}\n`;
  text += `📅 ${start} ~ ${end}\n\n`;
  text += `💰 총 지출(공동): ${formattedTotal}원\n`;
  text += `━━━━━━━━━━━━━━\n`;

  dayExpenses.forEach((day) => {
    const communalItems = day.expenses.filter(isCommunal);
    const dayTotal = sumCommunal(day.expenses);
    const dayLabel = dayjs(day.date).format("MM.DD (ddd)");

    text += `\n[Day ${day.dayNumber}] ${dayLabel}\n`;

    if (communalItems.length === 0) {
      text += ` - 공동 지출 내역 없음\n`;
    } else {
      communalItems.forEach((item) => {
        const memo = item.memo?.trim();
        const label = memo ? `${item.name} · ${memo}` : item.name;
        text += ` • ${label}: ${item.amount.toLocaleString()}원\n`;
      });
      text += ` (소계: ${dayTotal.toLocaleString()}원)\n`;
    }
  });

  return text;
}
