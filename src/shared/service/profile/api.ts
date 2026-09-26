import { supabase } from "@/shared/service/supabase/cilent";
import type { PackingStyle } from "@/shared/data/checkList";

/** DB 는 text 로 준다. 알 수 없는 값은 "아직 안 정함". */
const toPackingStyle = (value: string | null): PackingStyle | null =>
  value === "minimal" || value === "full" ? value : null;

/** 트리거 복원 이전 가입자는 프로필 행이 없을 수 있어 `maybeSingle` (getMyTier 와 같은 이유). */
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
 * `select("id")` 로 **0행을 에러로 만든다.** 없으면 프로필 행이 없는 사용자에게
 * UPDATE 가 조용히 0행이 되고, 매번 같은 질문을 다시 받는다.
 *
 * profiles 는 컬럼 단위 UPDATE 화이트리스트가 걸려 있다
 * (20260801000000_s_payment_hardening → 20260913000000 에서 권한 부여).
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
