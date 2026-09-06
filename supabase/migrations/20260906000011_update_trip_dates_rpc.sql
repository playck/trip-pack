-- =====================================================================
-- 여행 기간 변경 RPC (update_trip_dates)
--
-- 배경 (로컬 재현)
--   클라이언트의 updateTripDatesWithSchedules 는 삭제 → 날짜 재계산 → 여행 기간 갱신을 나눠 보낸다.
--   날짜 재계산이 "전체 SELECT 후 행마다 UPDATE" 라서 일정 20개·경비 15개면 요청이 40번을 넘고,
--   전부 개별 트랜잭션이다. 중간에 끊기면 이런 상태가 남는다.
--     - 삭제만 되고 기간은 그대로  → 데이터만 사라지고 화면은 그대로라 사용자가 다시 눌러 또 지운다
--     - 일정 절반만 새 날짜       → 같은 1일차인데 날짜가 서로 다른 항목이 섞인다
--     - 마지막 한 번만 실패       → 자식은 다 옮겨졌는데 trips.start_date 만 옛날이라 파생 계산이 전부 어긋난다
--
--   권한 구멍도 있었다. trips 의 UPDATE 정책은 소유자 전용인데 여행 설정 패널에는 게이트가 없다.
--   일반 멤버가 기간을 바꾸면 일정·경비는 옮겨지고 trips UPDATE 만 0행이 되는데, 0행은 오류가 아니라서
--   앱은 성공으로 처리한다. 조용한 데이터 오염이다. 이 함수는 소유자가 아니면 명확히 실패한다.
--
-- 설계
--   - SECURITY INVOKER. 권한 상승이 필요 없다. 소유자는 자식 테이블의 멤버 정책을 모두 통과하고,
--     trips 갱신도 소유자 정책을 통과한다. RLS 가 그대로 적용되는 편이 안전하다.
--   - 시작에서 trips 행을 FOR UPDATE 로 잠가 소유자 검증과 동시 호출 직렬화를 함께 처리한다.
--   - 날짜를 SQL 이 계산한다(start_date + (day_number - 1)). SELECT 와 행별 UPDATE 가 통째로 사라져
--     집합 UPDATE 한 문장이 된다. 기존 클라이언트 계산식과 동일하다.
--   - 값이 이미 같은 행은 WHERE 로 걸러 낸다. 불필요한 행 재작성(dead tuple)과 updated_at 갱신을 피한다.
--   - 삭제 순서는 기존 동작을 그대로 옮긴다. 범위 밖 일정에 "연결된 경비" 를 먼저 지운다.
--     일정만 지우면 FK 의 ON DELETE SET NULL (schedule_id) 때문에 경비가 연결만 끊긴 채 남는다.
--
-- 에러 (P0001)
--   NOT_OWNER      호출자가 이 여행의 소유자가 아님 (여행이 없을 때도 같은 에러)
--   INVALID_RANGE  시작일/종료일이 NULL 이거나 종료일이 시작일보다 앞섬
--                  (막지 않으면 기간이 0 이하가 되어 모든 일정이 범위 밖으로 계산된다)
--
-- 반환: 삭제된 일정 수 (기존 deletedScheduleCount 와 동일)
--
-- 운영 반영: SQL 에디터에서 그대로 실행. CREATE OR REPLACE 라 재실행 안전.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.update_trip_dates(
  p_trip_id             uuid,
  p_start_date          date,
  p_end_date            date,
  p_delete_out_of_range boolean DEFAULT false
)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_duration      integer;
  v_deleted_count integer := 0;
BEGIN
  IF p_start_date IS NULL OR p_end_date IS NULL OR p_end_date < p_start_date THEN
    RAISE EXCEPTION 'INVALID_RANGE' USING ERRCODE = 'P0001';
  END IF;

  -- 소유자 검증 + 같은 여행의 동시 기간 변경 직렬화
  PERFORM 1
    FROM public.trips
   WHERE id = p_trip_id AND user_id = (SELECT auth.uid())
     FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NOT_OWNER' USING ERRCODE = 'P0001';
  END IF;

  v_duration := (p_end_date - p_start_date) + 1;   -- 포함 일수. 1일 여행이면 1

  IF p_delete_out_of_range THEN
    -- 1) 범위 밖 일정에 연결된 경비 (일정보다 먼저 지워야 SET NULL 로 남지 않는다)
    DELETE FROM public.trip_expenses e
     WHERE e.trip_id = p_trip_id
       AND e.schedule_id IN (
         SELECT s.id FROM public.trip_schedules s
          WHERE s.trip_id = p_trip_id AND s.day_number > v_duration
       );

    -- 2) 범위 밖 일정
    WITH deleted AS (
      DELETE FROM public.trip_schedules
       WHERE trip_id = p_trip_id AND day_number > v_duration
      RETURNING 1
    )
    SELECT count(*) INTO v_deleted_count FROM deleted;

    -- 3) 일정에 연결되지 않은 범위 밖 경비
    DELETE FROM public.trip_expenses
     WHERE trip_id = p_trip_id
       AND day_number > v_duration
       AND schedule_id IS NULL;
  END IF;

  -- 4) 남은 일정·경비의 날짜를 새 시작일 기준으로 재배치
  UPDATE public.trip_schedules
     SET schedule_date = p_start_date + (day_number - 1)
   WHERE trip_id = p_trip_id
     AND schedule_date IS DISTINCT FROM p_start_date + (day_number - 1);

  UPDATE public.trip_expenses
     SET expense_date = p_start_date + (day_number - 1)
   WHERE trip_id = p_trip_id
     AND expense_date IS DISTINCT FROM p_start_date + (day_number - 1);

  -- 5) 항공편 (등록 규칙과 동일: 출발편 = 시작일, 리턴편 = 종료일)
  UPDATE public.trip_flights
     SET scheduled_date = CASE flight_type WHEN 'departure' THEN p_start_date ELSE p_end_date END
   WHERE trip_id = p_trip_id
     AND scheduled_date IS DISTINCT FROM
         CASE flight_type WHEN 'departure' THEN p_start_date ELSE p_end_date END;

  -- 6) 여행 기간
  UPDATE public.trips
     SET start_date = p_start_date, end_date = p_end_date
   WHERE id = p_trip_id;

  RETURN v_deleted_count;
END $$;

REVOKE ALL ON FUNCTION public.update_trip_dates(uuid, date, date, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_trip_dates(uuid, date, date, boolean) TO authenticated, service_role;

COMMENT ON FUNCTION public.update_trip_dates(uuid, date, date, boolean) IS
  'Owner-only: change trip dates atomically. Optionally deletes out-of-range schedules and their expenses, then re-derives schedule/expense/flight dates from the new start date. Returns deleted schedule count. P0001 NOT_OWNER / INVALID_RANGE. SECURITY INVOKER — existing RLS applies.';
