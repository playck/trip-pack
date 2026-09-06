-- =====================================================================
-- 가고 싶은 곳 → 일정 전환을 원자적으로 처리 (convert_wishlist_to_schedule)
--
-- 기존에는 클라이언트가 SELECT → INSERT → DELETE 세 번을 나눠 보냈고,
-- 그 사이 창에서 두 가지 문제가 발생했다.
--   1) DELETE 실패 시 일정은 생기고 위시리스트 항목은 남아 유령 항목이 됨
--      (사용자가 다시 누르면 같은 장소가 일정에 두 번 들어감)
--   2) 두 일행이 같은 항목을 동시에 옮기면 각자 SELECT 에 성공해 일정이 두 개 생김
--
-- DELETE ... RETURNING 을 먼저 두어 "삭제에 성공한 쪽만 원본을 손에 넣게" 한다.
-- 동시 호출 시 한 명만 이기고, 진 쪽은 0건 → NULL 을 받아 아무것도 만들지 않는다.
-- 트랜잭션이므로 중간 실패 시 일정도 남지 않는다.
--
-- SECURITY DEFINER 를 쓰지 않는다 (다른 RPC 들과 다른 점).
-- 권한 상승이 필요 없고, INVOKER 로 두면 trip_wishlists/trip_schedules 의
-- 기존 RLS 정책(trip_id IN (get_my_trip_ids()))이 그대로 적용된다.
-- 남의 여행 항목을 넘기면 DELETE 가 0건이라 NULL 이 반환된다.
--
-- visit_order 는 기존 클라이언트 로직과 동일하게 MAX+1 로 계산한다.
-- (동시 삽입 시 값이 겹칠 수 있으나 정렬 동률일 뿐이라 기존 동작을 유지한다)
-- =====================================================================

CREATE OR REPLACE FUNCTION public.convert_wishlist_to_schedule(
  p_wishlist_id   uuid,
  p_day_number    integer,
  p_schedule_date date
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  w             public.trip_wishlists%ROWTYPE;
  v_schedule_id uuid;
BEGIN
  -- 삭제와 동시에 원본 확보. 이미 정리된 항목이면 0건이라 NULL 을 반환한다.
  DELETE FROM public.trip_wishlists
  WHERE id = p_wishlist_id
  RETURNING * INTO w;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.trip_schedules (
    trip_id, day_number, schedule_date,
    place_id, place_name, place_address, latitude, longitude,
    visit_order, notes, category
  )
  VALUES (
    w.trip_id, p_day_number, p_schedule_date,
    w.place_id, w.place_name, w.place_address, w.latitude, w.longitude,
    (
      SELECT COALESCE(MAX(visit_order), 0) + 1
      FROM public.trip_schedules
      WHERE trip_id = w.trip_id AND day_number = p_day_number
    ),
    w.notes, w.category
  )
  RETURNING id INTO v_schedule_id;

  RETURN v_schedule_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.convert_wishlist_to_schedule(uuid, integer, date)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.convert_wishlist_to_schedule(uuid, integer, date) IS
  'Atomically moves a wishlist entry into a day schedule. DELETE ... RETURNING first so concurrent callers cannot both convert the same entry. Returns NULL when the entry no longer exists (already consumed, or not visible under RLS). SECURITY INVOKER — existing RLS policies apply.';

-- ---------------------------------------------------------------------
-- 역방향: 일정 → 가고 싶은 곳 (convert_schedule_to_wishlist)
--
-- 정방향만 원자적으로 두면 두 전환의 모양이 달라져, 나중에 컬럼이 하나 추가될 때
-- 손댈 곳이 SQL 함수와 클라이언트 코드로 갈린다. 한쪽을 빠뜨리면 전환할 때만
-- 값이 조용히 사라져 발견이 늦는다. 그래서 같은 구조로 맞춘다.
--
-- 경비는 삭제하지 않는다. 일정 행만 지우면 FK(trip_expenses_schedule_id_fkey)의
-- ON DELETE SET NULL 로 경비는 남고 schedule_id 연결만 해제된다.
--
-- 같은 장소가 이미 담겨 있으면(trip_id+place_id 유니크) 새로 만들지 않고
-- 기존 항목 id 를 돌려준다 — createWishlist 의 멱등 동작과 동일하다.
--
-- 메모 항목(place_id 가 MEMO_ 접두) 가드는 클라이언트에 남긴다.
-- place_id 는 불변이라 원자성이 필요 없고, MEMO_ 규칙까지 SQL 에 복제하면
-- 도메인 지식이 한 곳 더 늘어난다.
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.convert_schedule_to_wishlist(
  p_schedule_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  s             public.trip_schedules%ROWTYPE;
  v_wishlist_id uuid;
BEGIN
  -- 삭제와 동시에 원본 확보. 이미 없으면 0건이라 NULL 을 반환한다.
  DELETE FROM public.trip_schedules
  WHERE id = p_schedule_id
  RETURNING * INTO s;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.trip_wishlists (
    trip_id, place_id, place_name, place_address,
    latitude, longitude, notes, category, sort_order
  )
  VALUES (
    s.trip_id, s.place_id, s.place_name, s.place_address,
    s.latitude, s.longitude, s.notes, s.category,
    (
      SELECT COALESCE(MAX(sort_order), 0) + 1
      FROM public.trip_wishlists
      WHERE trip_id = s.trip_id
    )
  )
  ON CONFLICT (trip_id, place_id) DO NOTHING
  RETURNING id INTO v_wishlist_id;

  -- 이미 담겨 있던 장소 — 기존 항목 id 를 반환한다
  IF v_wishlist_id IS NULL THEN
    SELECT id INTO v_wishlist_id
    FROM public.trip_wishlists
    WHERE trip_id = s.trip_id AND place_id = s.place_id;
  END IF;

  RETURN v_wishlist_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.convert_schedule_to_wishlist(uuid)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.convert_schedule_to_wishlist(uuid) IS
  'Atomically moves a schedule entry back into the trip wishlist. Deletes only the schedule row so linked expenses survive with schedule_id set to NULL. Idempotent on (trip_id, place_id). Returns NULL when the schedule no longer exists (already moved, or not visible under RLS). SECURITY INVOKER — existing RLS policies apply.';
