import dayjs from "dayjs";
import type { DayExpense, ExpenseItemData, TripBasicInfo } from "../types";

const isCommunal = (e: ExpenseItemData) => !e.isPersonal;
const isMyPersonal = (userId: string | null) => (e: ExpenseItemData) =>
  e.isPersonal && !!userId && e.createdByUserId === userId;

export function formatAllExpensesToText(
  tripInfo: TripBasicInfo,
  dayExpenses: DayExpense[],
  currentUserId: string | null = null,
): string {
  const title = tripInfo.title || "여행 가계부";
  const start = dayjs(tripInfo.startDate).format("YYYY.MM.DD");
  const end = dayjs(tripInfo.endDate).format("YYYY.MM.DD");

  const sumCommunal = (expenses: ExpenseItemData[]) =>
    expenses.filter(isCommunal).reduce((sum, item) => sum + item.amount, 0);

  const myPersonalFilter = isMyPersonal(currentUserId);
  const sumMyPersonal = (expenses: ExpenseItemData[]) =>
    expenses
      .filter(myPersonalFilter)
      .reduce((sum, item) => sum + item.amount, 0);

  const totalCommunal = dayExpenses.reduce(
    (sum, day) => sum + sumCommunal(day.expenses),
    0,
  );
  const totalMyPersonal = dayExpenses.reduce(
    (sum, day) => sum + sumMyPersonal(day.expenses),
    0,
  );

  let text = `✈️ ${title}\n`;
  text += `📅 ${start} ~ ${end}\n\n`;
  text += `💰 공동 지출: ${totalCommunal.toLocaleString()}원\n`;
  if (totalMyPersonal > 0) {
    text += `🔖 내 개인 지출: ${totalMyPersonal.toLocaleString()}원\n`;
  }
  text += `━━━━━━━━━━━━━━\n`;
  text += `\n[공동 경비]\n`;

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

  if (totalMyPersonal > 0) {
    text += `\n━━━━━━━━━━━━━━\n`;
    text += `[내 개인 경비]\n`;
    dayExpenses.forEach((day) => {
      const personalItems = day.expenses.filter(myPersonalFilter);
      if (personalItems.length === 0) return;
      const dayLabel = dayjs(day.date).format("MM.DD (ddd)");
      const dayTotal = sumMyPersonal(day.expenses);
      text += `\n[Day ${day.dayNumber}] ${dayLabel}\n`;
      personalItems.forEach((item) => {
        const memo = item.memo?.trim();
        const label = memo ? `${item.name} · ${memo}` : item.name;
        text += ` • ${label}: ${item.amount.toLocaleString()}원\n`;
      });
      text += ` (소계: ${dayTotal.toLocaleString()}원)\n`;
    });
  }

  return text;
}
