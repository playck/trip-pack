-- =====================================================================
-- RLS: 작성자(created_by) 위조 차단, 초대 정책 정리, 멤버 자가 등록 차단
--
-- 배경 (모두 로컬에서 재현됨)
--   1) 경비·쇼핑·할일의 INSERT 정책이 "여행 멤버인가"만 보고 created_by 가 본인인지는 보지 않는다.
--      멤버 B 가 created_by = A 로 경비를 넣는 데 성공했다. 정산 화면은 created_by 로 개인 경비를
--      가르므로, 남의 이름으로 지출을 만들 수 있는 구멍이다.
--   2) trip_invitations 의 INSERT 정책이 둘이다. "소유자만" 옆에 "멤버면 가능"이 있고 정책은 OR 로
--      합쳐지므로 "소유자만"은 효력이 없다. 일반 멤버 B 가 초대를 만드는 데 성공했다. SELECT 도 같은
--      조건이 둘이다. 앱은 어느 멤버나 초대 링크를 만들 수 있게 되어 있으므로(TripSettingsPanel →
--      InviteSheet, 소유자 제한 없음) "멤버 + 본인 작성" 하나로 정리한다.
--   3) trip_members 의 INSERT 정책 "유저는 자신을 멤버로 추가 가능"은 WITH CHECK (user_id = auth.uid())
--      뿐이라, 여행 id 만 알면 초대 없이 아무 여행에나 스스로 들어갈 수 있다. 실제 가입 경로인
--      accept_invitation / create_trip_with_checklist 는 SECURITY DEFINER 라 이 정책이 없어도 동작하고,
--      클라이언트에 trip_members 직접 INSERT 는 없다. 정책을 제거한다.
--
-- 원칙
--   - "누가"를 컬럼으로 남기는 테이블은 INSERT 정책이 그 컬럼 = auth.uid() 를 강제한다.
--   - 같은 컬럼의 DEFAULT 도 auth.uid() 로 둔다. 값을 안 보내면 맞는 값이 들어가고, 다른 값을 보내면 거부된다.
--   - RLS 는 UPDATE 에서 이전 값(OLD)을 볼 수 없다. 작성자 변경 차단은 트리거가 맡는다.
--   - 새 정책은 TO authenticated 로 제한하고 auth.uid() 는 (select auth.uid()) 로 감싼다.
--   - 기존 정책 이름에 줄바꿈이 섞여 있어 이름으로 DROP 하지 않고 카탈로그에서 찾아 지운다.
--
-- trip_reservations 는 여기서 다루지 않는다. 운영에 아직 없는 개발 중 테이블이라, 같은 규칙을
-- 테이블을 만드는 20260905000000_trip_reservations.sql 안에 함께 두었다.
--
-- 운영 반영: SQL 에디터에서 그대로 실행. 재실행하면 새 정책도 같이 지웠다 다시 만들므로 안전하다.
-- =====================================================================

-- 0) 교체 대상 정책 일괄 제거 ------------------------------------------
--    대상: 네 테이블의 INSERT 정책 전부, trip_members 의 INSERT 정책 전부, trip_invitations 의 정책 전부
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        (tablename IN ('trip_expenses', 'shopping_categories', 'todo_categories',
                       'todo_items', 'trip_members')
         AND cmd = 'INSERT')
        OR tablename = 'trip_invitations'
      )
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

-- 1) created_by 기본값 = 호출자 ------------------------------------------
ALTER TABLE public.trip_expenses       ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.shopping_categories ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.todo_categories     ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.todo_items          ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.trip_invitations    ALTER COLUMN created_by SET DEFAULT auth.uid();

-- 2) INSERT 정책: 여행 멤버 + 본인 작성 ------------------------------------
CREATE POLICY trip_expenses_insert_member_self ON public.trip_expenses
  FOR INSERT TO authenticated
  WITH CHECK (
    trip_id IN (SELECT public.get_my_trip_ids())
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY shopping_categories_insert_member_self ON public.shopping_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    trip_id IN (SELECT public.get_my_trip_ids())
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY todo_categories_insert_member_self ON public.todo_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    trip_id IN (SELECT public.get_my_trip_ids())
    AND created_by = (SELECT auth.uid())
  );

-- todo_items 는 trip_id 가 없어 카테고리를 거쳐 여행을 확인한다.
CREATE POLICY todo_items_insert_member_self ON public.todo_items
  FOR INSERT TO authenticated
  WITH CHECK (
    category_id IN (
      SELECT id FROM public.todo_categories
      WHERE trip_id IN (SELECT public.get_my_trip_ids())
    )
    AND created_by = (SELECT auth.uid())
  );

-- 3) 작성자 불변 트리거 ----------------------------------------------------
--    INSERT 를 막아도 UPDATE 로 created_by 를 바꾸면 같은 위조가 된다. RLS 의 WITH CHECK 는
--    새 행만 보고 이전 값을 모르므로, 변경 자체를 트리거로 거부한다.
CREATE OR REPLACE FUNCTION public.forbid_created_by_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'created_by is immutable' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trip_expenses_created_by_immutable
  BEFORE UPDATE OF created_by ON public.trip_expenses
  FOR EACH ROW EXECUTE FUNCTION public.forbid_created_by_change();

CREATE OR REPLACE TRIGGER shopping_categories_created_by_immutable
  BEFORE UPDATE OF created_by ON public.shopping_categories
  FOR EACH ROW EXECUTE FUNCTION public.forbid_created_by_change();

CREATE OR REPLACE TRIGGER todo_categories_created_by_immutable
  BEFORE UPDATE OF created_by ON public.todo_categories
  FOR EACH ROW EXECUTE FUNCTION public.forbid_created_by_change();

CREATE OR REPLACE TRIGGER todo_items_created_by_immutable
  BEFORE UPDATE OF created_by ON public.todo_items
  FOR EACH ROW EXECUTE FUNCTION public.forbid_created_by_change();

CREATE OR REPLACE TRIGGER trip_invitations_created_by_immutable
  BEFORE UPDATE OF created_by ON public.trip_invitations
  FOR EACH ROW EXECUTE FUNCTION public.forbid_created_by_change();

-- 4) trip_invitations 정책 재구성 -----------------------------------------
--    조회: 멤버. 생성: 멤버 + 본인 작성. 수정·삭제: 만든 사람 또는 여행 소유자.
CREATE POLICY trip_invitations_select_member ON public.trip_invitations
  FOR SELECT TO authenticated
  USING (trip_id IN (SELECT public.get_my_trip_ids()));

CREATE POLICY trip_invitations_insert_member_self ON public.trip_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    trip_id IN (SELECT public.get_my_trip_ids())
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY trip_invitations_update_creator_or_owner ON public.trip_invitations
  FOR UPDATE TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR trip_id IN (SELECT public.get_my_owned_trip_ids())
  )
  WITH CHECK (
    created_by = (SELECT auth.uid())
    OR trip_id IN (SELECT public.get_my_owned_trip_ids())
  );

CREATE POLICY trip_invitations_delete_creator_or_owner ON public.trip_invitations
  FOR DELETE TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR trip_id IN (SELECT public.get_my_owned_trip_ids())
  );

-- 5) trip_members 자가 등록 정책 --------------------------------------------
--    0) 에서 제거했고 다시 만들지 않는다. 멤버 추가는 accept_invitation / create_trip_with_checklist
--    (SECURITY DEFINER) 만 할 수 있다.
COMMENT ON TABLE public.trip_members IS
  'No client INSERT policy on purpose. Rows are created only by SECURITY DEFINER RPCs (accept_invitation, create_trip_with_checklist).';
