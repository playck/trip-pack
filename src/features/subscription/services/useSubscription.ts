import { useQuery } from "@tanstack/react-query";
import { getMyTier, type SubscriptionTier } from "./api";

/** 유저별로 캐시를 분리한다(계정 전환 시 tier 누출 방지). */
export const subscriptionQueryKey = (userId: string | undefined) =>
  ["subscription", "tier", userId] as const;

interface UseSubscriptionOptions {
  /** false면 조회하지 않음(결제 미오픈 시 불필요한 Supabase 호출 방지). 기본 true. */
  enabled?: boolean;
}

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  isPremium: boolean;
  isLoading: boolean;
}

/**
 * 현재 유저의 프리미엄 여부. profiles.tier(서버 권위) 기반.
 * userId가 없으면(로그아웃) 조회하지 않는다. 결제/복원 성공 후
 * subscriptionQueryKey(userId)를 invalidate/setQueryData 하면 갱신된다.
 */
export function useSubscription(
  userId: string | undefined,
  options?: UseSubscriptionOptions,
): UseSubscriptionReturn {
  const { data, isLoading } = useQuery({
    queryKey: subscriptionQueryKey(userId),
    queryFn: () => getMyTier(userId as string),
    enabled: !!userId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    meta: { persist: true },
  });

  return {
    tier: data ?? "free",
    isPremium: data === "premium",
    isLoading,
  };
}
