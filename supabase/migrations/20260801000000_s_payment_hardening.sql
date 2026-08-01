-- =====================================================================
-- 결제 보안 하드닝 (배치 1 — 서버)
--   1) profiles.tier 클라이언트 직접 쓰기 잠금 (셀프-프리미엄 방지, 최대 리스크)
--   2) admin_users 운영자 seed (환불/부여 RPC가 죽지 않도록)
--   3) payment_events 금액/통화 정밀도 (amount numeric + currency)
--
-- 코드리뷰 CONFIRMED 대응: R#1(tier writable), R#6(admin seed 없음), R#amount/currency
-- =====================================================================

-- 1) tier 쓰기 잠금 --------------------------------------------------
-- 기존: GRANT ALL ON profiles TO authenticated + RLS '본인 프로필만 수정 가능'
--       → 누구나 PATCH /profiles {tier:'premium'}로 무료 프리미엄 획득.
-- 조치: authenticated/anon의 UPDATE 권한을 email/username 컬럼으로만 한정.
--       service_role(웹훅)·SECURITY DEFINER admin RPC는 영향 없음(정상 동작).
REVOKE UPDATE ON public.profiles FROM authenticated;
REVOKE UPDATE ON public.profiles FROM anon;
GRANT UPDATE (email, username) ON public.profiles TO authenticated;

-- 2) 운영자 admin_users seed (이메일 기준, 멱등) ----------------------
-- 없으면 grant_premium/manual_refund/force_downgrade가 항상 NOT_ADMIN으로 실패.
INSERT INTO public.admin_users (user_id, note)
SELECT id, '운영자 seed (payment hardening)'
FROM auth.users
WHERE email = 'playck@naver.com'
ON CONFLICT (user_id) DO NOTHING;

-- 3) 결제 금액/통화 정밀도 ------------------------------------------
-- 기존: amount integer + Math.round(USD price) → 통화 소실·소수점 손상.
-- 조치: amount를 numeric로, currency 컬럼 추가. 웹훅은 실제 구매통화 금액 저장.
ALTER TABLE public.payment_events
  ALTER COLUMN amount TYPE numeric USING amount::numeric;

ALTER TABLE public.payment_events
  ADD COLUMN IF NOT EXISTS currency text;

COMMENT ON COLUMN public.payment_events.amount IS
  'Charged amount in purchased currency (price_in_purchased_currency). See currency column.';
COMMENT ON COLUMN public.payment_events.currency IS
  'ISO currency of amount (e.g. KRW, USD). From RevenueCat event.currency.';
