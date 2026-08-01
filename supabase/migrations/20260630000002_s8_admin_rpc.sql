-- =====================================================================
-- S8: Admin RPC + audit log (운영 도구)
--   * grant_premium_until : 특정 유저에게 premium 부여 (보상/수동 충전)
--   * manual_refund       : 즉시 환불 → tier='free', expires_at=now()
--   * force_downgrade     : 강제 강등 → tier='free', expires_at=NULL
--
-- 공통 패턴
--   - SECURITY DEFINER (postgres 권한으로 실행, RLS 우회)
--   - admin_users 가드 → 미통과 시 P0001 NOT_ADMIN
--   - 대상 유저 존재 검사 → 미존재 시 P0001 USER_NOT_FOUND
--   - 성공 시 admin_audit_log 1행 INSERT (admin_user_id, action, target_user_id, payload)
--
-- 클라가 직접 호출 시 P0001 에러로 차단됨 (RLS와 무관, 함수 본문 검증).
-- GRANT EXECUTE TO authenticated 로 PostgREST 노출하되 admin_users 가드로 실권한 제어.
-- =====================================================================

-- 1) grant_premium_until -----------------------------------------------
CREATE OR REPLACE FUNCTION public.grant_premium_until(
  target_user_id uuid,
  until          timestamptz,
  reason         text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  IF until IS NULL OR until <= now() THEN
    RAISE EXCEPTION 'INVALID_UNTIL' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles
     SET tier = 'premium', expires_at = until
   WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (
    auth.uid(),
    'grant_premium_until',
    target_user_id,
    jsonb_build_object('until', until, 'reason', reason)
  );
END $$;

GRANT EXECUTE ON FUNCTION public.grant_premium_until(uuid, timestamptz, text)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.grant_premium_until(uuid, timestamptz, text) IS
  'Admin-only: grant target user premium until given timestamp. P0001 NOT_ADMIN / INVALID_UNTIL / USER_NOT_FOUND. Logs to admin_audit_log.';

-- 2) manual_refund -----------------------------------------------------
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
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles
     SET tier = 'free', expires_at = now()
   WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (
    auth.uid(),
    'manual_refund',
    target_user_id,
    jsonb_build_object('reason', reason)
  );
END $$;

GRANT EXECUTE ON FUNCTION public.manual_refund(uuid, text)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.manual_refund(uuid, text) IS
  'Admin-only: immediate refund (7-day 청약철회 등). Sets expires_at=now() to terminate premium. Logs to admin_audit_log.';

-- 3) force_downgrade ---------------------------------------------------
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
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'NOT_ADMIN' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles
     SET tier = 'free', expires_at = NULL
   WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'USER_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, payload)
  VALUES (
    auth.uid(),
    'force_downgrade',
    target_user_id,
    jsonb_build_object('reason', reason)
  );
END $$;

GRANT EXECUTE ON FUNCTION public.force_downgrade(uuid, text)
  TO authenticated, service_role;

COMMENT ON FUNCTION public.force_downgrade(uuid, text) IS
  'Admin-only: forced downgrade (어뷰징/약관 위반). Clears expires_at to NULL. Logs to admin_audit_log.';
