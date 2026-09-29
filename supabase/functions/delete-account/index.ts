// =====================================================================
// 회원 탈퇴 — 호출한 본인 계정을 실제로 삭제
//
//   흐름: JWT로 본인 확인 → prepare_account_deletion(일행 있는 방장 여행 승계, 혼자 여행 id 반환)
//         → auth.admin.deleteUser (FK CASCADE/SET NULL이 나머지 정리)
//         → 삭제된 혼자 여행의 커버 사진 정리 (trip-images/{userId}/{tripId}/)
//
//   사진은 계정 삭제 뒤에 지운다. 계정 삭제가 실패했는데 사진만 사라지면 남은 여행이 깨진다.
//   사진 정리 실패는 탈퇴 실패로 보지 않는다(고아 파일만 남음).
//   넘겨진 여행의 사진은 탈퇴자 폴더에 있어도 여행이 계속 참조하므로 지우지 않는다.
//
//   결제 기록(payment_events)은 FK가 없어 남는다 — 전자상거래법상 보관 대상.
//   ponytail: Apple 로그인 토큰 revoke 미포함, 후속 작업(.p8 키 + 네이티브 재인증 필요).
//
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 는 런타임이 자동 주입. verify_jwt 기본값(true) 사용.
// =====================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const BUCKET_NAME = "trip-images";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer /, "");
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return json({ error: "unauthorized" }, 401);

  const { data: soloTripIds, error: prepError } = await supabase.rpc(
    "prepare_account_deletion",
    { p_user_id: user.id },
  );
  if (prepError) {
    console.error("prepare_account_deletion failed", prepError);
    return json({ error: "prepare_failed" }, 500);
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("deleteUser failed", deleteError);
    return json({ error: "delete_failed" }, 500);
  }

  for (const tripId of (soloTripIds ?? []) as string[]) {
    const folder = `${user.id}/${tripId}`;
    const { data: files } = await supabase.storage.from(BUCKET_NAME).list(folder);
    if (!files?.length) continue;
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(files.map((f) => `${folder}/${f.name}`));
    if (error) console.error("trip image cleanup failed", folder, error);
  }

  return json({ ok: true });
});
