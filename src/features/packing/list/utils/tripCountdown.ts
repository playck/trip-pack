import dayjs from "dayjs";

export interface TripCountdown {
  /** 오늘 → 출발일 남은 일수 (출발 후에는 음수) */
  daysUntilTrip: number;
  /** 오늘 → 종료일 남은 일수 (여행이 끝나면 음수) */
  daysUntilTripEnd: number;
}

/**
 * 여행까지 남은 일수를 계산한다.
 *
 * 훅이 아니라 순수 함수인 이유: 결과가 "오늘"에 의존하는데 startDate/endDate는
 * 바뀌지 않으므로, useMemo로 감싸면 웹뷰를 띄워둔 채 날짜가 넘어가도 값이 갱신되지
 * 않는다. 렌더마다 호출해야 정확하므로 메모이제이션하지 말 것.
 */
export function getTripCountdown(
  startDate: string,
  endDate?: string | null,
): TripCountdown {
  const today = dayjs().startOf("day");
  return {
    daysUntilTrip: dayjs(startDate).startOf("day").diff(today, "day"),
    daysUntilTripEnd: dayjs(endDate || startDate)
      .startOf("day")
      .diff(today, "day"),
  };
}
