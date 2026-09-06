-- =====================================================================
-- 여행 소유권 불변식을 DB 가 지키게 한다
--
-- 배경
--   소유권이 두 곳에 있다. trips.user_id 와 trip_members.role = 'owner'.
--   DB 함수(get_my_owned_trip_ids, 무료 3개 한도)와 trips 의 UPDATE/DELETE 정책은 trips.user_id 를 보고,
--   앱의 isOwner 판단은 trip_members.role 을 본다. 그런데 둘을 묶는 제약이 하나도 없었다.
--     - trips.user_id 가 NULL 허용 → 주인 없는 여행이 만들어질 수 있다.
--     - 한 여행에 owner 가 0명이거나 2명인 것을 막지 않는다.
--     - trip_members DELETE 정책의 "본인" 조항 때문에 owner 가 자기 멤버 행을 지울 수 있다.
--       그러면 여행은 목록에서 사라지는데(조회는 멤버십 기준) 무료 한도에는 계속 계산된다(한도는 user_id 기준).
--
-- 불변식 (이 파일이 보장하는 것)
--   1) 모든 여행에는 주인이 있다                      → trips.user_id NOT NULL
--   2) 한 여행의 owner 행은 최대 하나다               → 부분 유니크 인덱스 (trip_id) WHERE role = 'owner'
--   3) 여행이 살아 있는 동안 owner 행은 지워지지 않는다 → DELETE 정책에서 제외 + 트리거로 이중 방어
--   owner 행 생성은 create_trip_with_checklist 가 여행과 같은 트랜잭션에서 하고, role 변경은 UPDATE 정책이
--   없어 클라이언트가 못 하며, trips.user_id 변경은 UPDATE 정책의 WITH CHECK 가 막는다. 그래서 위 셋이면
--   "여행마다 owner 행이 정확히 하나이고 그 user_id 가 trips.user_id 다"가 유지된다.
--
-- 트리거와 CASCADE
--   owner 행은 두 가지 정상 경로로 지워진다. 여행 삭제(trips → trip_members CASCADE)와 회원 탈퇴
--   (profiles → trip_members CASCADE). 트리거는 이 둘을 막으면 안 된다. 그래서 "여행이 아직 있고,
--   그 사람의 프로필도 아직 있을 때"만 거부한다. CASCADE 로 들어온 삭제는 부모 행이 이미 지워진 뒤라
--   조건에 걸리지 않는다.
--
-- 운영 반영 전 사전 점검 (모두 0 이어야 한다. 0 이 아니면 이 파일을 실행하지 말고 먼저 데이터를 정리한다)
--   select count(*) from public.trips where user_id is null;
--   select count(*) from public.trips t where not exists
--     (select 1 from public.trip_members m where m.trip_id = t.id and m.role = 'owner');
--   select count(*) from (select trip_id from public.trip_members where role = 'owner'
--     group by trip_id having count(*) > 1) s;
--   select count(*) from public.trips t join public.trip_members m
--     on m.trip_id = t.id and m.role = 'owner' where m.user_id <> t.user_id;
--
-- 운영 반영: SQL 에디터에서 그대로 실행. 재실행 안전.
-- =====================================================================

-- 1) trips.user_id NOT NULL ------------------------------------------------
-- NULL 이 있으면 owner 멤버로 채우고, 그래도 남으면 명확한 메시지로 실패시킨다(조용히 진행하지 않는다).
UPDATE public.trips t
   SET user_id = m.user_id
  FROM public.trip_members m
 WHERE t.user_id IS NULL
   AND m.trip_id = t.id
   AND m.role = 'owner';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.trips WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'trips.user_id has NULL rows without an owner member. Resolve them before SET NOT NULL.';
  END IF;
END $$;

ALTER TABLE public.trips ALTER COLUMN user_id SET NOT NULL;

-- 2) 여행당 owner 는 최대 하나 ------------------------------------------------
-- 부분 유니크 인덱스: role = 'owner' 인 행에 대해서만 trip_id 가 유일해야 한다.
-- 기존 데이터에 두 명 이상 owner 인 여행이 있으면 여기서 실패한다(위 사전 점검).
CREATE UNIQUE INDEX IF NOT EXISTS trip_members_one_owner_per_trip
  ON public.trip_members (trip_id)
  WHERE role = 'owner';

-- 3) owner 행 직접 삭제 차단 트리거 ------------------------------------------
CREATE OR REPLACE FUNCTION public.forbid_owner_member_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF OLD.role = 'owner'
     AND EXISTS (SELECT 1 FROM public.trips    WHERE id = OLD.trip_id)   -- 여행 삭제 CASCADE 가 아니고
     AND EXISTS (SELECT 1 FROM public.profiles WHERE id = OLD.user_id)   -- 회원 탈퇴 CASCADE 도 아닐 때
  THEN
    RAISE EXCEPTION 'trip owner cannot be removed while the trip exists. Delete the trip or transfer ownership.'
      USING ERRCODE = '42501';
  END IF;
  RETURN OLD;
END $$;

CREATE OR REPLACE TRIGGER trip_members_forbid_owner_delete
  BEFORE DELETE ON public.trip_members
  FOR EACH ROW EXECUTE FUNCTION public.forbid_owner_member_delete();

-- 4) DELETE 정책: owner 행 제외 ------------------------------------------------
-- 클라이언트에는 에러 대신 "0행"으로 조용히 거부된다. 트리거는 service_role 이나 SQL 에디터 실수까지 막는 안전망.
-- 기존 정책 이름에 줄바꿈이 있어 카탈로그에서 찾아 지운다.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'trip_members' AND cmd = 'DELETE'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.trip_members', p.policyname);
  END LOOP;
END $$;

CREATE POLICY trip_members_delete_owner_or_self ON public.trip_members
  FOR DELETE TO authenticated
  USING (
    role <> 'owner'
    AND (
      trip_id IN (SELECT public.get_my_owned_trip_ids())   -- 소유자가 멤버를 내보낸다
      OR user_id = (SELECT auth.uid())                     -- 멤버가 스스로 나간다
    )
  );

COMMENT ON INDEX public.trip_members_one_owner_per_trip IS
  'At most one owner row per trip. Together with trips.user_id NOT NULL and the delete guard, every trip has exactly one owner.';
