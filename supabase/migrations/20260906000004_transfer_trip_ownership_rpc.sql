-- =====================================================================
-- 여행 소유권 이전 RPC (transfer_trip_ownership)
--
-- 배경
--   20260906000003 에서 "여행이 살아 있는 동안 owner 행은 지워지지 않는다"를 강제했다.
--   그 결과 주인은 여행을 삭제하지 않고는 나갈 수 없다. 일행 넷이 일정·할일을 쌓아 둔 공유 여행을
--   주인 사정으로 통째로 지우는 건 답이 아니므로, 소유권을 다른 멤버에게 넘기는 정문을 만든다.
--   넘긴 뒤의 예전 주인은 일반 멤버라 기존 DELETE 정책으로 스스로 나갈 수 있다.
--
-- 왜 RPC 인가 (클라이언트 세 번 호출이 안 되는 이유)
--   1) 순서 의존: 부분 유니크 인덱스(여행당 owner 하나) 때문에 승격을 먼저 하면 owner 가 둘이 되어 실패한다.
--      강등 → 승격 → trips.user_id 순서를 한 트랜잭션에서 지켜야 한다.
--   2) 권한: trip_members 에는 UPDATE 정책이 없고, trips 의 UPDATE 정책은 user_id 변경을 막는다.
--      둘 다 의도된 잠금이므로 SECURITY DEFINER 로 우회하되, 함수 안에서 호출자를 직접 검증한다.
--   3) 경합: 두 이전이 동시에 들어오거나 이전 중에 대상이 내보내지면 불변식이 깨질 수 있다.
--      trips 행을 FOR UPDATE 로 잠가 같은 여행의 이전을 직렬화하고, 승격 UPDATE 가 0행이면 실패시킨다.
--
-- 결정 (2026-09-06)
--   - 명시적 이전만 제공한다. "나가기"에 자동 승계는 붙이지 않는다(필요해지면 이 함수를 재사용해 얹는다).
--   - 이전받는 사람의 무료 한도(3개)는 검사하지 않는다. 한도는 "만들기"를 제한하는 장치다.
--
-- 에러 (P0001, 클라이언트가 메시지로 분기)
--   NOT_OWNER      호출자가 이 여행의 주인이 아님 (여행이 없을 때도 같은 에러: 존재 여부를 노출하지 않음)
--   NOT_A_MEMBER   대상이 이 여행의 멤버가 아님
--   ALREADY_OWNER  대상이 이미 주인
--
-- 운영 반영: SQL 에디터에서 그대로 실행. CREATE OR REPLACE 라 재실행 안전.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.transfer_trip_ownership(
  p_trip_id      uuid,
  p_new_owner_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;

  IF p_new_owner_id = v_uid THEN
    RAISE EXCEPTION 'ALREADY_OWNER' USING ERRCODE = 'P0001';
  END IF;

  -- 호출자 = 현재 주인 검증 + 같은 여행의 동시 이전 직렬화 (트랜잭션 끝까지 행 잠금)
  PERFORM 1
    FROM public.trips
   WHERE id = p_trip_id AND user_id = v_uid
     FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = 'P0001';
  END IF;

  -- 1) 강등: 현재 owner 행 → member  (승격보다 먼저. owner 는 동시에 둘일 수 없다)
  UPDATE public.trip_members
     SET role = 'member'
   WHERE trip_id = p_trip_id AND role = 'owner';

  -- 2) 승격: 대상 멤버 행 → owner. 0행이면 대상이 멤버가 아니거나 방금 내보내진 것 → 전체 롤백
  UPDATE public.trip_members
     SET role = 'owner'
   WHERE trip_id = p_trip_id AND user_id = p_new_owner_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_A_MEMBER' USING ERRCODE = 'P0001';
  END IF;

  -- 3) trips.user_id 를 새 주인으로. 여기까지 한 트랜잭션이라 중간 실패 시 아무것도 바뀌지 않는다
  UPDATE public.trips
     SET user_id = p_new_owner_id
   WHERE id = p_trip_id;
END $$;

-- 로그인 사용자만 호출. anon 은 auth.uid() 가 NULL 이라 어차피 실패하지만 노출 자체를 막는다.
REVOKE ALL ON FUNCTION public.transfer_trip_ownership(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transfer_trip_ownership(uuid, uuid) TO authenticated, service_role;

COMMENT ON FUNCTION public.transfer_trip_ownership(uuid, uuid) IS
  'Owner-only: hand trip ownership to another member atomically (demote → promote → trips.user_id). P0001 NOT_OWNER / NOT_A_MEMBER / ALREADY_OWNER. Locks the trips row to serialize concurrent transfers.';
