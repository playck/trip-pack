-- =====================================================================
-- S1: Subscription MVP
--   * subscription_tier_enum: 'free' | 'premium'
--   * profiles.tier (NOT NULL DEFAULT 'free')
--   * profiles.expires_at (NULL)
--   * payment_events (UNIQUE provider+event_id, idempotent webhook)
--   * admin_users (admin RPC 가드 allowlist)
--   * admin_audit_log (admin 행위 추적, append-only)
--
-- 설계 원칙
--   - 한도/등급/만료 판정은 RPC + RLS (server authoritative)
--   - 결제 이벤트는 (provider, provider_event_id) UNIQUE로 멱등
--   - 모든 신규 객체에 RLS enable + 정책 명시 (PostgREST 직접 접근 차단)
--   - IF NOT EXISTS / DROP IF EXISTS로 재실행 안전
-- =====================================================================

-- 1) ENUM ---------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'subscription_tier_enum'
  ) THEN
    CREATE TYPE public.subscription_tier_enum AS ENUM ('free', 'premium');
  END IF;
END $$;

-- 2) profiles 확장 ------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tier public.subscription_tier_enum NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS expires_at timestamptz NULL;

CREATE INDEX IF NOT EXISTS profiles_tier_expires_idx
  ON public.profiles (tier, expires_at)
  WHERE tier = 'premium';

COMMENT ON COLUMN public.profiles.tier IS
  'Subscription tier. Server-authoritative. Free until paid via toss-webhook.';
COMMENT ON COLUMN public.profiles.expires_at IS
  'Premium expiry timestamptz. NULL for free. grandfather_sweep cron downgrades expired premium.';

-- 3) payment_events (멱등 결제 이벤트 로그) -----------------------------
CREATE TABLE IF NOT EXISTS public.payment_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider          text NOT NULL CHECK (provider IN ('toss', 'apple', 'google')),
  provider_event_id text NOT NULL,
  event_type        text NOT NULL,
  amount            integer NULL,
  raw_payload       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  processed_at      timestamptz NULL,
  CONSTRAINT payment_events_provider_event_unique UNIQUE (provider, provider_event_id)
);

CREATE INDEX IF NOT EXISTS payment_events_user_created_idx
  ON public.payment_events (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS payment_events_unprocessed_idx
  ON public.payment_events (created_at)
  WHERE processed_at IS NULL;

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payment_events_select_own ON public.payment_events;
CREATE POLICY payment_events_select_own
  ON public.payment_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE 는 service_role(webhook)만 가능. RLS가 일반 클라이언트를 차단.

COMMENT ON TABLE public.payment_events IS
  'Idempotent payment event log. UNIQUE(provider, provider_event_id) prevents duplicate processing.';

-- 4) admin_users (운영자 allowlist) ------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  note       text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 본인 행 SELECT만 허용 (클라가 "내가 admin인가" 확인용)
DROP POLICY IF EXISTS admin_users_select_own ON public.admin_users;
CREATE POLICY admin_users_select_own
  ON public.admin_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/DELETE 는 service_role 또는 SQL Editor 운영자만. PostgREST 클라 경로 없음.

COMMENT ON TABLE public.admin_users IS
  'Manually maintained admin allowlist. Required for admin RPCs (grant_premium_until, manual_refund, force_downgrade).';

-- 5) admin_audit_log (append-only 감사 로그) ---------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   uuid NOT NULL REFERENCES auth.users(id),
  action          text NOT NULL,
  target_user_id  uuid NULL REFERENCES auth.users(id),
  payload         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_target_created_idx
  ON public.admin_audit_log (target_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_created_idx
  ON public.admin_audit_log (admin_user_id, created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_audit_log_select_admin ON public.admin_audit_log;
CREATE POLICY admin_audit_log_select_admin
  ON public.admin_audit_log
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

COMMENT ON TABLE public.admin_audit_log IS
  'Append-only audit trail of admin actions. Never delete rows.';
