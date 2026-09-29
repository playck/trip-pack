-- =====================================================================
-- 회원 탈퇴 준비 함수 (prepare_account_deletion)
--
-- 배경
--   auth.users 를 지우면 profiles → trips(user_id) CASCADE 로 내가 방장인 여행이 통째로 사라진다.
--   일행이 있는 여행이면 일행의 짐·일정·경비까지 함께 사라진다(여행 삭제 차단과 같은 문제).
--   그래서 계정을 지우기 전에, 일행이 있는 방장 여행은 가장 먼저 합류한 일행에게 넘긴다.
--
-- 동작
--   - 탈퇴자가 방장인 여행을 FOR UPDATE 로 잠그고 하나씩 처리한다.
--   - 일행이 있으면: 강등 → 승격 → trips.user_id (transfer_trip_ownership 과 같은 순서)
--   - 혼자면: 그대로 둔다. 계정 삭제 CASCADE 로 지워진다.
--   - 반환: 계정 삭제 시 함께 지워질(=혼자인) 여행 id 목록. 호출 측이 Storage 사진 정리에 쓴다.
--
-- 권한
--   service_role 전용 (Edge Function delete-account 가 JWT 로 본인 확인 후 호출).
--   인자로 아무 user_id 나 받으므로 authenticated 에 열면 남의 여행을 넘길 수 있다 → 절대 GRANT 금지.
--   trips 업데이트 트리거(enforce_trip_update_scope)는 auth.uid() 가 NULL 인 서버 경로를 통과시킨다.
--
-- 운영 반영: SQL 에디터에서 그대로 실행. CREATE OR REPLACE 라 재실행 안전.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.prepare_account_deletion(p_user_id uuid)
RETURNS SETOF uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trip_id  uuid;
  v_heir_id  uuid;
BEGIN
  FOR v_trip_id IN
    SELECT id FROM public.trips WHERE user_id = p_user_id FOR UPDATE
  LOOP
    SELECT user_id INTO v_heir_id
      FROM public.trip_members
     WHERE trip_id = v_trip_id AND user_id <> p_user_id
     ORDER BY joined_at NULLS LAST, id
     LIMIT 1;

    IF v_heir_id IS NULL THEN
      RETURN NEXT v_trip_id;
      CONTINUE;
    END IF;

    UPDATE public.trip_members SET role = 'member'
     WHERE trip_id = v_trip_id AND role = 'owner';
    UPDATE public.trip_members SET role = 'owner'
     WHERE trip_id = v_trip_id AND user_id = v_heir_id;
    UPDATE public.trips SET user_id = v_heir_id
     WHERE id = v_trip_id;
  END LOOP;
END $$;

REVOKE ALL ON FUNCTION public.prepare_account_deletion(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prepare_account_deletion(uuid) TO service_role;

COMMENT ON FUNCTION public.prepare_account_deletion(uuid) IS
  'service_role only. Before deleting a user, hand each owned trip that has companions to the earliest-joined member. Returns ids of solo trips that the account deletion will cascade.';
