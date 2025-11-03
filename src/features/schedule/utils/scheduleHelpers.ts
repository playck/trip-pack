import type { Schedule } from "../types";

/**
 * 스케줄이 메모인지 확인
 */
export const isMemo = (schedule: Schedule): boolean => {
  return schedule.place_id.startsWith("MEMO_");
};

/**
 * 메모용 place_id 생성
 */
export const createMemoId = (): string => {
  return `MEMO_${crypto.randomUUID()}`;
};
