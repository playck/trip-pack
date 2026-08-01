import { supabase } from "@/shared/service/supabase/cilent";

export type SubscriptionTier = "free" | "premium";

/**
 * 주어진 유저의 구독 등급(tier)을 조회한다.
 * 서버 권위: profiles.tier 가 단일 진실. 클라는 UI 표시용으로만 참조.
 * - userId는 호출부(로그인 세션)에서 전달 → 별도 auth 네트워크 호출 없음.
 * - 프로필 행이 아직 없으면 'free'(에러 아님). 실제 DB 오류는 throw(무료로 위장 금지).
 */
export const getMyTier = async (
  userId: string
): Promise<SubscriptionTier> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return (data?.tier as SubscriptionTier | undefined) ?? "free";
};
