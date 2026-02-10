/** 경비 항목 */
export interface ExpenseItemData {
  id: string;
  name: string;
  amount: number;
  scheduleId?: string | null;
}

/** 날짜별 경비 그룹 */
export interface DayExpense {
  date: string;
  label: string;
  dayNumber: number;
  expenses: ExpenseItemData[];
}

/** 여행 기본 정보 */
export interface TripBasicInfo {
  title: string | null;
  startDate: string;
  endDate: string;
}
