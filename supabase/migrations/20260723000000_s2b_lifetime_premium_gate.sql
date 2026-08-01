-- =====================================================================
-- S2b: 한도 게이트 lifetime(영구 언락) 지원
--   결제 모델 전환: 웹 Toss 구독 → 앱 IAP 일회성 언락 (RevenueCat)
--
--   변경점: premium 활성 판정에서 expires_at IS NULL 을 "영구"로 해석.
--     - premium + expires_at NULL      → 영구 언락 (일회성 구매)  ← 신규
--     - premium + expires_at > now()   → 기간제 (admin 수동 부여)
--     - premium + expires_at <= now()  → 만료 → free 취급
--     - free                           → 3개 제한
--
--   안전성: 현재 premium 사용자 0명 → 의미 변경 충돌 없음.
--   함수 본문의 나머지(INSERT 로직)는 S2와 동일.
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

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다';
  END IF;

  PERFORM pg_advisory_xact_lock(1, hashtext(v_user_id::text)::int);

  SELECT tier, expires_at
    INTO v_tier, v_expires_at
  FROM public.profiles
  WHERE id = v_user_id;

  -- premium 활성 판정: expires_at NULL = 영구, 미래 시각 = 기간제
  IF NOT (
    v_tier = 'premium'
    AND (v_expires_at IS NULL OR v_expires_at > now())
  ) THEN
    SELECT count(*) INTO v_trip_count
    FROM public.trips
    WHERE user_id = v_user_id;

    IF v_trip_count >= 3 THEN
      RAISE EXCEPTION 'TRIP_LIMIT_EXCEEDED' USING ERRCODE = 'P0001';
    END IF;
  END IF;

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

  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (v_trip_id, v_user_id, 'owner');

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

COMMENT ON FUNCTION public.create_trip_with_checklist(jsonb, jsonb, jsonb) IS
  'Atomic trip + checklist creation with tier gate. premium+expires_at NULL = lifetime unlock (IAP one-time). P0001 TRIP_LIMIT_EXCEEDED when free tier already has 3 trips.';
