import dayjs from "dayjs";
import { customPalette } from "@/shared/constants/colors";

export function formatTodoInfo(
  dueDate: string | null,
  assigneeNames: string[]
): string {
  const parts: string[] = [];

  if (dueDate) {
    parts.push(formatDday(dueDate));
  }

  if (assigneeNames.length > 0) {
    parts.push(assigneeNames.join(", "));
  }

  return parts.join(" · ");
}

export function formatDueDateLabel(dueDate: string | null): string {
  if (!dueDate) return "";
  return formatDday(dueDate);
}

function formatDday(dueDate: string): string {
  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  const diff = due.diff(today, "day");

  if (diff < 0) {
    const days = Math.abs(diff);
    return `${days}일 지남`;
  }
  if (diff === 0) return "오늘 마감";
  if (diff === 1) return "내일 마감";
  return `${diff}일 남음`;
}

/**
 * 마감일 기준 색상 반환
 * - 체크 안 됨 + 2일 이내(초과/오늘/내일): 시스템 레드(rose) 계열
 * - 3일 남음: orange
 * - 여유: gray
 */
export function getDueDateColor(
  dueDate: string | null,
  isChecked?: boolean
): string {
  if (!dueDate) return "gray.500";

  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  const diff = due.diff(today, "day");

  // 체크 완료된 항목은 강조 불필요
  if (isChecked) return "gray.500";

  // 기한 초과 또는 2일 이내 → 시스템 레드(rose)
  if (diff <= 2) return customPalette.rose[500];
  // 3일 남음 → orange
  if (diff <= 3) return "orange.500";
  return "gray.500";
}
