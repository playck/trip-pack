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
