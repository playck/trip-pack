// 인천공항 API 시간 포맷 "HHMM" (e.g., "0615") → "06:15"
export const formatFlightTime = (dateTimeStr: string): string => {
  if (!dateTimeStr || dateTimeStr.length < 4) return "--:--";
  // API returns 4-char "HHMM" format
  const hour = dateTimeStr.substring(0, 2);
  const min = dateTimeStr.substring(2, 4);
  return `${hour}:${min}`;
};
