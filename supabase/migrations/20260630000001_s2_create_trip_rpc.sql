-- =====================================================================
-- S2: RPC 한도 게이트 (create_trip_with_checklist)
--   * 함수 본문 교체 (시그니처 동일 — 호출부 무수정)
--     - pg_advisory_xact_lock(1, hashtext(uid)) : 동시 4번째 trip 직렬화
--     - tier/expires_at 조회 → premium 비활성 시 trip 카운트 검사
--     - 4번째 시도 시 RAISE EXCEPTION 'TRIP_LIMIT_EXCEEDED' (P0001)
--   * trips INSERT RLS 정책 DROP
--     - PostgREST 직접 INSERT 경로 차단 (한도 게이트 우회 방지)
--     - SECURITY DEFINER RPC는 RLS 우회로 정상 동작
--
-- advisory_lock namespace: 1 = trip 생성 한도 게이트 (subscription-mvp-v3 부록 A)
-- =====================================================================

CREATE OR REPLACE FUNCTION public.create_trip_with_checklist(
  p_trip_data  jsonb,
  p_categories jsonb,
  p_items      jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id    uuid;
  v_tier       public.subscription_tier_enum;
  v_expires_at timestamptz;
  v_trip_count int;
  v_trip_id    uuid;
BEGIN
  v_user_id := auth.uid();

  -- 인증 확인
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다';
  END IF;

  -- 동일 user 동시 호출 직렬화 (트랜잭션 종료 시 자동 해제)
  PERFORM pg_advisory_xact_lock(1, hashtext(v_user_id::text)::int);

  -- 등급/만료 조회
  SELECT tier, expires_at
    INTO v_tier, v_expires_at
  FROM public.profiles
  WHERE id = v_user_id;

  -- premium 비활성 상태에서만 한도 적용
  IF NOT (
    v_tier = 'premium'
    AND v_expires_at IS NOT NULL
    AND v_expires_at > now()
  ) THEN
    SELECT count(*) INTO v_trip_count
    FROM public.trips
    WHERE user_id = v_user_id;

    IF v_trip_count >= 3 THEN
      RAISE EXCEPTION 'TRIP_LIMIT_EXCEEDED' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- 1. 여행 생성
  INSERT INTO public.trips (
    title, start_date, end_date, region_id, region_name,
    country_code, companion_type, companion_types, trip_types, user_id
  )
  VALUES (
    p_trip_data->>'title',
    (p_trip_data->>'start_date')::date,
    (p_trip_data->>'end_date')::date,
    p_trip_data->>'region_id',
    p_trip_data->>'region_name',
    p_trip_data->>'country_code',
    p_trip_data->>'companion_type',
    p_trip_data->'companion_types',
    p_trip_data->'trip_types',
    v_user_id
  )
  RETURNING id INTO v_trip_id;

  -- 2. trip_members owner
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (v_trip_id, v_user_id, 'owner');

  -- 3. 카테고리 일괄 생성
  INSERT INTO public.checklist_categories (
    id, name, icon_key, display_order, trip_id, created_by
  )
  SELECT
    (elem->>'id')::uuid,
    elem->>'name',
    elem->>'icon_key',
    (elem->>'display_order')::int,
    v_trip_id,
    v_user_id
  FROM jsonb_array_elements(p_categories) AS elem;

  -- 4. 아이템 일괄 생성
  INSERT INTO public.checklist_items (
    name, is_required, is_checked, notes,
    cabin_notes, cabin_policy, display_order, category_id
  )
  SELECT
    elem->>'name',
    (elem->>'is_required')::boolean,
    (elem->>'is_checked')::boolean,
    elem->>'notes',
    elem->>'cabin_notes',
    elem->>'cabin_policy',
    (elem->>'display_order')::int,
    (elem->>'category_id')::uuid
  FROM jsonb_array_elements(p_items) AS elem;

  RETURN v_trip_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_trip_with_checklist(jsonb, jsonb, jsonb)
  TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.create_trip_with_checklist(jsonb, jsonb, jsonb) IS
  'Atomic trip + checklist creation with subscription tier gate. P0001 TRIP_LIMIT_EXCEEDED when free tier already has 3 trips. pg_advisory_xact_lock(1, uid) prevents concurrent 4th-trip race.';

-- ---------------------------------------------------------------------
-- trips INSERT RLS 정책 제거 — PostgREST 직접 INSERT 차단
-- 일반 사용자는 RPC 경로만 사용 가능. RPC는 SECURITY DEFINER로 RLS 우회.
-- SELECT/UPDATE/DELETE 정책은 기존 그대로 유지.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "유저는 본인 여행만 관리 가능" ON public.trips;
