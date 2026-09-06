-- =====================================================================
-- 인덱스 정리: 중복·포함 인덱스 제거, FK 컬럼 인덱스 보강
--
-- 배경 (카탈로그 조회 결과)
--   - 정의가 완전히 같은 쌍 7개: 읽기 이득은 0, 쓰기마다 두 번 갱신.
--   - 다른 인덱스의 선행 접두사라 불필요한 것 8개: (a) 는 (a, b) 로 대체된다 (선행 컬럼 규칙).
--   - FK 인데 선행 인덱스가 없는 컬럼 11개: 부모가 지워질 때 SET NULL/CASCADE 가 자식 테이블을 전체 스캔한다.
--   - idx_expenses_category: 앱은 항상 trip_id 로 먼저 거르고 분류는 클라이언트에서 한다. 단독 조회가 없다.
--
-- 판단 기준
--   "A 의 컬럼 목록이 B 의 선행 접두사이고 둘 다 조건(partial)이 없으면 A 는 불필요하다."
--   유니크 제약이 만든 인덱스는 제약을 지우지 않는 한 남으므로, 그것을 덮개로 삼아 일반 인덱스를 지운다.
--   NULL 허용 FK 컬럼의 인덱스는 WHERE col IS NOT NULL 부분 인덱스로 만든다. FK 검사와 조인은 NULL 을
--   찾지 않으므로 NULL 행을 인덱스에 넣을 이유가 없고, 인덱스가 작아진다.
--
-- trip_reservations 의 인덱스는 여기 없다. 운영에 아직 없는 개발 중 테이블이라
-- 20260905000000_trip_reservations.sql 안에 함께 두었다.
--
-- 운영 반영: IF EXISTS / IF NOT EXISTS 라 재실행 안전. 행이 많은 테이블이면 CREATE INDEX 는 CONCURRENTLY 로
--   트랜잭션 밖에서 단독 실행한다.
-- =====================================================================

-- 1) 완전 중복 --------------------------------------------------------------
-- profiles_id_key (PK 와 같은 UNIQUE(id)) 는 남긴다.
--   profiles 를 참조하는 FK 12개가 전부 PK 가 아니라 이 유니크 제약에 매달려 있다 (pg_constraint.conindid).
--   FK 는 참조 대상의 유니크 인덱스 중 하나를 골라 의존하는데, 덤프에서 UNIQUE 가 PK 보다 먼저 만들어져 이쪽이 선택됐다.
--   지우려면 FK 12개를 DROP → ADD 해야 하고(각각 전체 검증 + 잠금), profiles 는 작은 테이블이라 이득이 거의 없다.
--   확인: select conrelid::regclass, conname from pg_constraint
--         where contype = 'f' and conindid = 'public.profiles_id_key'::regclass;
DROP INDEX IF EXISTS public.idx_shopping_categories_trip;                -- = idx_shopping_categories_trip_id
DROP INDEX IF EXISTS public.idx_shopping_items_category;                 -- = idx_shopping_items_category_id
DROP INDEX IF EXISTS public.idx_todo_item_assignees_item;                -- = idx_todo_item_assignees_item_id
DROP INDEX IF EXISTS public.idx_expenses_day_number;                     -- = idx_trip_expenses_trip_day
DROP INDEX IF EXISTS public.idx_expenses_schedule_id;                    -- = idx_trip_expenses_schedule_id
DROP INDEX IF EXISTS public.idx_expenses_trip_id;                        -- = idx_trip_expenses_trip_id

-- 2) 선행 접두사로 덮이는 것 --------------------------------------------------
DROP INDEX IF EXISTS public.idx_checklist_categories_trip_id;  -- ⊂ idx_categories_display_order (trip_id, display_order)
DROP INDEX IF EXISTS public.idx_checklist_items_category_id;   -- ⊂ idx_items_display_order (category_id, display_order)
DROP INDEX IF EXISTS public.idx_template_items_category_id;    -- ⊂ template_items_category_lower_name_uniq (category_id, ...)
DROP INDEX IF EXISTS public.idx_todo_item_assignees_item_id;   -- ⊂ todo_item_assignees_todo_item_id_member_id_key
DROP INDEX IF EXISTS public.idx_trip_expenses_trip_id;         -- ⊂ idx_trip_expenses_trip_date / idx_trip_expenses_trip_day
DROP INDEX IF EXISTS public.idx_trip_flights_trip_id;          -- ⊂ trip_flights_trip_id_flight_type_key
DROP INDEX IF EXISTS public.idx_trip_schedules_trip_id;        -- ⊂ idx_trip_schedules_trip_day_order
DROP INDEX IF EXISTS public.idx_trip_schedules_day_number;     -- ⊂ idx_trip_schedules_trip_day_order

-- 3) 쓰임 없는 단독 인덱스 ----------------------------------------------------
DROP INDEX IF EXISTS public.idx_expenses_category;

-- 4) FK 컬럼 인덱스 보강 -----------------------------------------------------
-- 멤버가 여행에서 빠질 때 SET NULL
CREATE INDEX IF NOT EXISTS shopping_items_assignee_id_idx
  ON public.shopping_items (assignee_id) WHERE assignee_id IS NOT NULL;

-- 회원 탈퇴 때 SET NULL / CASCADE (드물지만 테이블 전체 스캔을 피한다)
CREATE INDEX IF NOT EXISTS checklist_categories_created_by_idx
  ON public.checklist_categories (created_by);                              -- NOT NULL 컬럼
CREATE INDEX IF NOT EXISTS trip_invitations_created_by_idx
  ON public.trip_invitations (created_by);                                  -- NOT NULL 컬럼
CREATE INDEX IF NOT EXISTS trip_expenses_created_by_idx
  ON public.trip_expenses (created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS shopping_categories_created_by_idx
  ON public.shopping_categories (created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS shopping_items_checked_by_idx
  ON public.shopping_items (checked_by) WHERE checked_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS todo_categories_created_by_idx
  ON public.todo_categories (created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS todo_items_created_by_idx
  ON public.todo_items (created_by) WHERE created_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS todo_items_checked_by_idx
  ON public.todo_items (checked_by) WHERE checked_by IS NOT NULL;
