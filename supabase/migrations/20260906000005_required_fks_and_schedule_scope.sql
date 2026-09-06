-- =====================================================================
-- 필수 FK 컬럼 NOT NULL + 일정 연결의 여행 범위 강제
--
-- 배경
--   1) checklist_categories.trip_id, checklist_items.category_id, checklist_templates.user_id 가 NULL 허용이었다.
--      의미상 부모 없이는 존재할 수 없는 행인데, NULL 이 들어가면 어떤 RLS 정책에도 걸리지 않는 유령 행이 된다.
--      (정책이 전부 부모를 거쳐 권한을 판단하므로) 클라이언트와 RPC 는 항상 값을 넣고 있다.
--   2) trip_expenses.schedule_id 가 trip_schedules(id) 만 참조해서,
--      두 여행에 모두 속한 사용자는 X 여행의 경비를 Y 여행의 일정에 붙일 수 있었다.
--      복합 FK (trip_id, schedule_id) → trip_schedules(trip_id, id) 로 "같은 여행의 일정"만 허용한다.
--
-- 복합 FK 메모
--   - 참조 대상은 유니크여야 하므로 trip_schedules 에 UNIQUE (trip_id, id) 를 추가한다. PK 가 id 라 논리적으로는
--     항상 유일하지만, FK 는 정확히 그 컬럼 조합의 유니크 제약을 요구한다.
--   - ON DELETE SET NULL (schedule_id): 일정이 지워지면 schedule_id 만 비우고 trip_id 는 남긴다 (PG15+ 문법).
--     컬럼 목록 없이 SET NULL 을 쓰면 trip_id 까지 NULL 로 만들려다 NOT NULL 위반으로 실패한다.
--   - MATCH SIMPLE(기본): schedule_id 가 NULL 이면 검사하지 않는다. 일정 없는 경비는 그대로 허용된다.
--
-- trip_reservations 도 같은 복합 FK 가 필요하지만 여기서 다루지 않는다. 운영에 아직 없는 개발 중
-- 테이블이라, 테이블을 만드는 20260905000000_trip_reservations.sql 안에 함께 두었다.
-- 이 파일이 만드는 trip_schedules 의 UNIQUE (trip_id, id) 를 그쪽에서도 쓴다.
--
-- 운영 반영 전 사전 점검
--   select version();                      -- 15 이상
--   select count(*) from public.checklist_categories where trip_id is null;      -- 0
--   select count(*) from public.checklist_items where category_id is null;       -- 0
--   select count(*) from public.checklist_templates where user_id is null;       -- 0
--   교차 여행 연결은 아래에서 자동으로 끊는다(잘못된 연결이라 보존 가치가 없다).
-- =====================================================================

-- 1) NOT NULL ------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.checklist_categories WHERE trip_id IS NULL)
  OR EXISTS (SELECT 1 FROM public.checklist_items      WHERE category_id IS NULL)
  OR EXISTS (SELECT 1 FROM public.checklist_templates  WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'NULL rows exist in required FK columns. Clean them up before SET NOT NULL.';
  END IF;
END $$;

ALTER TABLE public.checklist_categories ALTER COLUMN trip_id     SET NOT NULL;
ALTER TABLE public.checklist_items      ALTER COLUMN category_id SET NOT NULL;
ALTER TABLE public.checklist_templates  ALTER COLUMN user_id     SET NOT NULL;

-- 2) 교차 여행 연결 끊기 (있다면) --------------------------------------------
UPDATE public.trip_expenses e
   SET schedule_id = NULL
  FROM public.trip_schedules s
 WHERE s.id = e.schedule_id AND s.trip_id <> e.trip_id;

-- 3) 참조 대상 유니크 (ADD CONSTRAINT 는 IF NOT EXISTS 가 없어 카탈로그로 확인) --
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trip_schedules_trip_id_id_key' AND conrelid = 'public.trip_schedules'::regclass
  ) THEN
    ALTER TABLE public.trip_schedules
      ADD CONSTRAINT trip_schedules_trip_id_id_key UNIQUE (trip_id, id);
  END IF;
END $$;

-- 4) 단일 FK → 복합 FK ------------------------------------------------------
ALTER TABLE public.trip_expenses
  DROP CONSTRAINT IF EXISTS trip_expenses_schedule_id_fkey,
  DROP CONSTRAINT IF EXISTS trip_expenses_trip_schedule_fkey,
  ADD CONSTRAINT trip_expenses_trip_schedule_fkey
    FOREIGN KEY (trip_id, schedule_id) REFERENCES public.trip_schedules (trip_id, id)
    ON DELETE SET NULL (schedule_id);

COMMENT ON CONSTRAINT trip_expenses_trip_schedule_fkey ON public.trip_expenses IS
  'schedule_id must belong to the same trip. Deleting the schedule only clears schedule_id.';
