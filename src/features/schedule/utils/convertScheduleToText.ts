import type { Schedule } from "../types";
import { isMemo } from "./scheduleHelpers";

/**
 * 일정 데이터를 공유 가능한 텍스트 형태로 변환
 */
export function convertSchedulesToText(
  schedules: Schedule[],
  tripTitle?: string
): string {
  if (!schedules || schedules.length === 0) {
    return "일정이 없습니다.";
  }

  // 일차별로 그룹화
  const schedulesByDay = schedules.reduce(
    (acc, schedule) => {
      const day = schedule.day_number;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(schedule);
      return acc;
    },
    {} as Record<number, Schedule[]>
  );

  let text = "";

  if (tripTitle) {
    text += `📍 ${tripTitle}\n`;
    text += "─".repeat(20) + "\n\n";
  }

  // 일차별로 정렬하여 텍스트 생성
  const sortedDays = Object.keys(schedulesByDay)
    .map(Number)
    .sort((a, b) => a - b);

  sortedDays.forEach((dayNumber, dayIdx) => {
    const daySchedules = schedulesByDay[dayNumber];

    text += `${dayNumber}일차 일정\n`;

    const sortedSchedules = [...daySchedules].sort(
      (a, b) => a.visit_order - b.visit_order
    );

    sortedSchedules.forEach((schedule, idx) => {
      const scheduleNumber = idx + 1;

      const timePrefix = schedule.start_time
        ? `[${schedule.start_time}] `
        : "";

      if (isMemo(schedule)) {
        text += `${scheduleNumber}. 📝 ${schedule.place_name}`;
      } else {
        text += `${scheduleNumber}. ${timePrefix}${schedule.place_name}`;
      }

      if (schedule.notes) {
        text += `\n   ㄴ ${schedule.notes}`;
      }

      text += "\n";
    });

    const isNotLastDay = dayIdx < sortedDays.length - 1;
    if (isNotLastDay) {
      text += "\n";
    }
  });

  return text;
}
