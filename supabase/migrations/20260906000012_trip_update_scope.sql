-- =====================================================================
-- 여행 정보 수정 권한을 정리한다: 메모만 멤버, 나머지는 전부 방장
--
-- 배경
--   trips 의 UPDATE 정책이 소유자 전용인데 여행 설정 패널에는 게이트가 없었다.
--   일반 멤버가 제목·메모·이미지를 바꾸면 0행이 되는데 0행은 오류가 아니라서 앱은 성공으로 처리했다.
--
-- 결정 (2026-09-06)
--   제목·예산·커버이미지·기간·삭제는 방장의 권한으로 둔다. 여행의 정체성과 돈에 해당하는 값이고,
--   일행에게 "방장이 있다" 는 것이 드러나는 편이 낫다는 판단이다. UI 에서도 방장에게만 노출한다.
--   메모만 멤버에게 연다. 일행이 함께 적는 공유 메모라 방장만 쓰게 할 이유가 없다.
--
-- 왜 정책이 아니라 트리거인가
--   RLS 정책은 "이 행을 수정해도 되는가" 만 말할 수 있고 "어느 컬럼까지" 는 말하지 못한다.
--   컬럼 권한(GRANT UPDATE (col))은 역할 단위라 "방장이면 전체, 멤버면 메모만" 을 표현하지 못한다.
--   그래서 정책은 멤버로 넓히고, 컬럼 범위는 BEFORE UPDATE 트리거가 지킨다.
--
--   허용 컬럼을 빼고 나머지가 그대로인지를 jsonb 비교로 확인한다. 컬럼 목록을 나열하지 않으므로
--   나중에 컬럼이 추가돼도 자동으로 "방장만" 쪽에 들어간다. 빠뜨려서 뚫리는 일이 없다.
--
--   auth.uid() 가 NULL 인 호출(service_role, SQL 에디터)은 검사하지 않는다. 이들은 RLS 자체를
--   우회하는 신뢰된 경로라 트리거만 막는 것이 오히려 일관성을 해친다. anon 은 000010 에서
--   테이블 권한을 회수해 이 경로에 도달하지 못한다.
--
-- 함께 유지되는 것
--   - update_trip_dates(SECURITY INVOKER)는 방장만 통과하므로 트리거도 통과한다.
--   - transfer_trip_ownership(SECURITY DEFINER)은 RLS·트리거 모두 우회한다. 함수 안에서 소유자를 검증한다.
--   - 여행 삭제는 그대로 소유자 전용(trips_delete 정책 유지).
--
-- 운영 반영: SQL 에디터에서 그대로 실행. 재실행 안전.
-- =====================================================================

-- 1) UPDATE 정책을 멤버로 확대 ---------------------------------------------
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'trips' AND cmd = 'UPDATE'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.trips', p.policyname);
  END LOOP;
END $$;

CREATE POLICY trips_update ON public.trips
  FOR UPDATE TO authenticated
  USING (id IN (SELECT public.get_my_trip_ids()))
  WITH CHECK (id IN (SELECT public.get_my_trip_ids()));

-- 2) 컬럼 범위는 트리거가 지킨다 ---------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_trip_update_scope()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := (SELECT auth.uid());
BEGIN
  -- 신뢰된 서버 경로(service_role, SQL 에디터)는 검사하지 않는다
  IF v_uid IS NULL THEN
    RETURN NEW;
  END IF;

  -- 방장은 모든 컬럼을 바꿀 수 있다
  IF OLD.user_id = v_uid THEN
    RETURN NEW;
  END IF;

  -- 그 밖의 멤버는 메모만. 나머지가 하나라도 달라지면 거부한다.
  IF (to_jsonb(NEW) - 'memo') IS DISTINCT FROM (to_jsonb(OLD) - 'memo') THEN
    RAISE EXCEPTION 'NOT_OWNER' USING
      ERRCODE = '42501',
      DETAIL  = 'Only the trip owner can change fields other than memo.';
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trips_enforce_update_scope
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.enforce_trip_update_scope();

COMMENT ON FUNCTION public.enforce_trip_update_scope() IS
  'Members may update only memo; the owner may update anything. Column scope is enforced here because RLS policies cannot restrict columns. New columns default to owner-only.';
