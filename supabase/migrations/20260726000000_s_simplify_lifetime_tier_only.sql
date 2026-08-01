-- =====================================================================
-- Simplify: 일회성 언락 전용 → expires_at 제거, tier 단일 판정
--
--   결정(2026-07-26): 기간제 comp 미운영 → expires_at 불필요.
--   프리미엄 = 한 번 결제로 영구. 만료 개념 없음.
--
--   변경:
--     1) 게이트 함수: premium 판정을 tier='premium' 만으로
--     2) grant_premium_until(→timestamptz) 폐기 → grant_premium(영구 부여)
--     3) manual_refund / force_downgrade: tier='free' 만
--     4) profiles.expires_at 컬럼 + 관련 인덱스 DROP
--
--   안전성: 현재 premium 유저 0명 → 컬럼 데이터 손실 없음.
-- =====================================================================

-- 0) expires_at 의존 인덱스 먼저 제거 (컬럼 DROP 전제)
DROP INDEX IF EXISTS public.profiles_tier_expires_idx;

-- 1) 게이트 함수: tier 단일 판정 -------------------------------------
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
  v_trip_count int;
  v_trip_id    uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION '로그인이 필요합니다';
  END IF;

  PERFORM pg_advisory_xact_lock(1, hashtext(v_user_id::text)::int);

  SELECT tier INTO v_tier
  FROM public.profiles
  WHERE id = v_user_id;

  -- free 만 3개 제한. premium 은 영구 무제한.
  IF v_tier IS DISTINCT FROM 'premium' THEN
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
  'Atomic trip + checklist creation with tier gate. free = max 3 trips (P0001), premium = unlimited (lifetime unlock).';

-- 2) grant_premium_until 폐기 → grant_premium (영구 부여) --------------
DROP FUNCTION IF EXISTS public.grant_premium_until(uuid, timestamptz, text);

CREATE OR REPLACE FUNCTION public.grant_premium(
  target_user_id uuid,
  reason         text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles SET tier = 'premium' WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (auth.uid(), 'grant_premium', target_user_id,
          jsonb_build_object('reason', reason));
END $$;

GRANT EXECUTE ON FUNCTION public.grant_premium(uuid, text)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.grant_premium(uuid, text) IS
  'Admin-only: grant lifetime premium. P0001 NOT_ADMIN / USER_NOT_FOUND. Logs to admin_audit_log.';

-- 3) manual_refund / force_downgrade: tier=free 만 -------------------
CREATE OR REPLACE FUNCTION public.manual_refund(
  target_user_id uuid,
  reason         text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles SET tier = 'free' WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (auth.uid(), 'manual_refund', target_user_id,
          jsonb_build_object('reason', reason));
END $$;

CREATE OR REPLACE FUNCTION public.force_downgrade(
  target_user_id uuid,
  reason         text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles SET tier = 'free' WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (auth.uid(), 'force_downgrade', target_user_id,
          jsonb_build_object('reason', reason));
END $$;

-- 4) 컬럼 제거 --------------------------------------------------------
ALTER TABLE public.profiles DROP COLUMN IF EXISTS expires_at;
