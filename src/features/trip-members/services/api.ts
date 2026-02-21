import { supabase } from "@/shared/service/supabase/cilent";
import type { Database } from "@/shared/types/database.type";

type TripMember = Database["public"]["Tables"]["trip_members"]["Row"];
type TripInvitation = Database["public"]["Tables"]["trip_invitations"]["Row"];

export interface TripMemberWithProfile extends TripMember {
  profiles: { username: string | null; email: string | null } | null;
}

/** 여행 멤버 목록 조회 */
export const getTripMembers = async (
  tripId: string
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

/** 초대 코드 생성 */
export const createInvitation = async (
  tripId: string
): Promise<TripInvitation> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const inviteCode = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

  const { data, error } = await supabase
    .from("trip_invitations")
    .insert({
      trip_id: tripId,
      invite_code: inviteCode,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`초대 링크 생성 실패: ${error.message}`);
  }

  return data;
};

/** 초대 코드로 초대 정보 조회 */
export const getInvitationByCode = async (
  inviteCode: string
): Promise<TripInvitation & { trips: { title: string } | null }> => {
  const { data, error } = await supabase
    .from("trip_invitations")
    .select("*, trips(title)")
    .eq("invite_code", inviteCode)
    .eq("is_active", true)
    .single();

  if (error) {
    throw new Error(`초대 정보 조회 실패: ${error.message}`);
  }

  return data as TripInvitation & { trips: { title: string } | null };
};

/** 초대 수락 (멤버로 참가) */
export const acceptInvitation = async (
  inviteCode: string
): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  // 1. 초대 정보 조회
  const invitation = await getInvitationByCode(inviteCode);

  // 2. 이미 멤버인지 확인
  const { data: existing } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", invitation.trip_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return invitation.trip_id;
  }

  // 3. 멤버로 추가
  const { error } = await supabase.from("trip_members").insert({
    trip_id: invitation.trip_id,
    user_id: user.id,
    role: "member",
  });

  if (error) {
    throw new Error(`여행 참가 실패: ${error.message}`);
  }

  return invitation.trip_id;
};

/** 멤버 제거 (owner만 가능) */
export const removeMember = async (memberId: string): Promise<void> => {
  const { error } = await supabase
    .from("trip_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    throw new Error(`멤버 제거 실패: ${error.message}`);
  }
};
