import { supabase } from "@/shared/service/supabase/cilent";
import type { Database } from "@/shared/types/database.type";

type TripMember = Database["public"]["Tables"]["trip_members"]["Row"];
type TripInvitation = Database["public"]["Tables"]["trip_invitations"]["Row"];

export interface TripMemberWithProfile extends TripMember {
  profiles: { username: string | null; email: string | null } | null;
}

/** 현재 사용자가 해당 trip의 멤버인지 확인 */
export const verifyTripMembership = async (tripId: string): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: member } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) {
    throw new Error("해당 여행의 멤버만 접근할 수 있습니다.");
  }
};

/** 여행 멤버 목록 조회 */
export const getTripMembers = async (
  tripId: string,
): Promise<TripMemberWithProfile[]> => {
  const { data, error } = await supabase
    .from("trip_members")
    .select("*, profiles(username, email)")
    .eq("trip_id", tripId)
    .order("joined_at", { ascending: true });

  if (error) {
    throw new Error(`멤버 목록 조회 실패: ${error.message}`);
  }

  return (data as TripMemberWithProfile[]) ?? [];
};

/** 초대 코드 조회 또는 생성 (기존 초대코드가 있으면 재사용) */
export const createInvitation = async (
  tripId: string,
): Promise<TripInvitation> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) throw new Error("로그인이 필요합니다.");

  // 하루 이상 남은 초대가 있으면 재사용 — 곧 만료될 링크를 단톡방에 다시 뿌리지 않게
  const reusableUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const { data: existing } = await supabase
    .from("trip_invitations")
    .select()
    .eq("trip_id", tripId)
    .eq("is_active", true)
    .gt("expires_at", reusableUntil.toISOString())
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  // 없으면 새로 생성
  const inviteCode = crypto.randomUUID().replace(/-/g, "");

  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7일 후 만료

  const { data, error } = await supabase
    .from("trip_invitations")
    .insert({
      trip_id: tripId,
      invite_code: inviteCode,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`초대 링크 생성 실패: ${error.message}`);
  }

  return data;
};

/** 초대 수락: SECURITY DEFINER RPC로 코드 검증 + 멤버 추가를 한 번에 처리 */
export const acceptInvitation = async (
  inviteCode: string,
): Promise<{ tripId: string; tripTitle: string }> => {
  const { data, error } = await supabase.rpc("accept_invitation", {
    p_code: inviteCode,
  });

  if (error) {
    if (error.message.includes("invalid_or_expired_invitation")) {
      throw new Error("유효하지 않거나 만료된 초대 링크입니다.");
    }
    throw new Error(`여행 참가 실패: ${error.message}`);
  }

  const row = data?.[0];
  if (!row) {
    throw new Error("유효하지 않거나 만료된 초대 링크입니다.");
  }

  return { tripId: row.out_trip_id, tripTitle: row.out_trip_title };
};

/** 멤버 제거 (owner만 가능) */
export const removeMember = async (memberId: string): Promise<void> => {
  const [authResult, memberResult] = await Promise.all([
    supabase.auth.getSession(),
    supabase.from("trip_members").select("trip_id").eq("id", memberId).single(),
  ]);

  const user = authResult.data.session?.user ?? null;
  if (!user) throw new Error("로그인이 필요합니다.");

  const targetMember = memberResult.data;
  if (memberResult.error || !targetMember) {
    throw new Error("삭제 대상 멤버를 찾을 수 없습니다.");
  }

  // 현재 사용자가 해당 trip의 owner인지 확인
  const { data: ownerCheck } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", targetMember.trip_id)
    .eq("user_id", user.id)
    .eq("role", "owner")
    .maybeSingle();

  if (!ownerCheck) {
    throw new Error(
      "멤버 제거 권한이 없습니다. 여행 소유자만 멤버를 제거할 수 있습니다.",
    );
  }

  const { error } = await supabase
    .from("trip_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(`멤버 제거 실패: ${error.message}`);
  }
};

const TRANSFER_ERROR_MESSAGES: Record<string, string> = {
  NOT_OWNER: "방장만 방장을 넘길 수 있어요.",
  NOT_A_MEMBER:
    "이 여행의 일행에게만 넘길 수 있어요. 목록을 새로고침해 주세요.",
  ALREADY_OWNER: "이미 방장인 일행이에요.",
};

/** 방장 넘기기 — 강등·승격·trips.user_id 변경을 한 트랜잭션으로 처리하는 RPC */
export const transferTripOwnership = async (
  tripId: string,
  newOwnerUserId: string,
): Promise<void> => {
  const { error } = await supabase.rpc("transfer_trip_ownership", {
    p_trip_id: tripId,
    p_new_owner_id: newOwnerUserId,
  });

  if (error) {
    throw new Error(
      TRANSFER_ERROR_MESSAGES[error.message] ??
        `방장 넘기기 실패: ${error.message}`,
    );
  }
};

/**
 * 여행 나가기 — 내 멤버 행만 지운다. 내가 적은 경비·할 일은 일행에게 남는다.
 * 방장 행은 DB가 삭제를 막으므로(여행당 방장 1명) 방장은 먼저 넘겨야 한다.
 */
export const leaveTrip = async (tripId: string): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("trip_members")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    throw new Error(`여행 나가기 실패: ${error.message}`);
  }
  if (!data?.length) {
    throw new Error("이미 나간 여행이거나 방장이라 나갈 수 없어요.");
  }
};
