import dayjs from "dayjs";

export const formatDateRange = (
  startDate: Date | null,
  endDate: Date | null
): string => {
  if (!startDate || !endDate) return "";

  const startDay = dayjs(startDate);
  const endDay = dayjs(endDate);

  const isSameYear = startDay.year() === endDay.year();

  if (!isSameYear) {
    const start = startDay.format("YYYY.MM-DD");
    const end = endDay.format("YYYY.MM-DD");
    return `${start} ~ ${end}`;
  } else {
    const start = startDay.format("MM-DD");
    const end = endDay.format("MM-DD");
    return `${start} ~ ${end}`;
  }
};

export const formatTripDateRange = (
  startDate: string,
  endDate: string | null
): string => {
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : null;

  const startStr = start.format("M월 D일");

  if (!end) return startStr;

  const endStr = end.format("M월 D일");

  return `${startStr} ~ ${endStr}`;
};

export const getDuration = (startDate: string, endDate: string | null) => {
  if (!endDate) return "1일";

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffDays = end.diff(start, "day") + 1;

  return `${diffDays}일`;
};

// 여행까지 남은 일수 계산
export const getDaysUntilTrip = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffTime = start.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 여행 기간 계산 유틸리티
export const getTripDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
