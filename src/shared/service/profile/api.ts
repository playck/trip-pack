import { supabase } from "@/shared/service/supabase/cilent";
import type { PackingStyle } from "@/shared/data/checkList";

/** DB 는 text 로 주므로 좁혀서 쓴다. 알 수 없는 값은 "아직 안 정함"으로 취급한다. */
const toPackingStyle = (value: string | null): PackingStyle | null =>
  value === "minimal" || value === "full" ? value : null;

/**
 * 내 짐 스타일. `null` 은 **아직 안 물어봤다**는 뜻이고,
 * 마법사에 성향 질문 단계를 띄우는 트리거로 쓴다.
 *
 * 프로필 행이 없어도 에러로 만들지 않는다(`maybeSingle`).
 * getMyTier 와 같은 이유 — 트리거 복원 이전 가입자는 행이 없을 수 있다.
 */
export const getMyPackingStyle = async (
  userId: string
): Promise<PackingStyle | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("packing_style")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return toPackingStyle(data?.packing_style ?? null);
};

/**
 * 짐 스타일 저장.
 *
 * `select("id")` 로 갱신된 행을 돌려받아 **0행을 에러로 만든다.** 이게 없으면
 * 프로필 행이 없는 사용자에게 UPDATE 가 조용히 0행이 되고, 앱도 사용자도 모른 채
 * 매번 같은 질문을 다시 받는다.
 *
 * profiles 는 컬럼 단위 UPDATE 화이트리스트가 걸려 있다
 * (20260801000000_s_payment_hardening). packing_style 권한은
 * 20260913000000_profiles_packing_style 에서 부여했다.
 */
export const updateMyPackingStyle = async (
  userId: string,
  packingStyle: PackingStyle
): Promise<void> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ packing_style: packingStyle })
    .eq("id", userId)
    .select("id");

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error("프로필을 찾을 수 없어 짐 스타일을 저장하지 못했습니다.");
  }
};
