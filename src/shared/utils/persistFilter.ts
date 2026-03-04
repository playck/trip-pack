import type { Query, QueryClient } from "@tanstack/react-query";
import type { TripInfo } from "@/shared/service/trip/tripInfo";

const PERSIST_WINDOW_DAYS = 2;

/**
 * 출발 2일 전 ~ 여행 종료일 사이의 여행 쿼리만 persist 대상으로 판단
 */
export function isTripWithinPersistWindow(
  query: Query,
  queryClient: QueryClient,
): boolean {
  const [queryName, tripId] = query.queryKey as [string, string | undefined];

  // 여행 목록은 상세 데이터 접근의 진입점이므로 항상 persist
  if (queryName === "tripList") return true;

  if (!tripId) return false;

  const tripInfo =
    queryName === "tripInfo"
      ? (query.state.data as TripInfo | null)
      : queryClient.getQueryData<TripInfo | null>(["tripInfo", tripId]);

  if (!tripInfo) return false;

  const today = startOfDay(new Date());
  const start = new Date(tripInfo.startDate);
  const end = new Date(tripInfo.endDate);
  const windowStart = new Date(
    start.getTime() - PERSIST_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  return today >= windowStart && today <= end;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
