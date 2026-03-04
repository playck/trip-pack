import { isHoliday } from "@hyunbinseo/holidays-kr";

export const isKoreanHoliday = (date: Date): boolean => {
  try {
    return isHoliday(date);
  } catch {
    return false;
  }
};
