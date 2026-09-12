-- =====================================================================
-- profiles.packing_style — 사용자의 짐 스타일(체크리스트 생성 성향)
--
-- 배경
--   같은 옵션으로 체크리스트를 만든 두 사용자가 완전히 동일한 결과를 받는다.
--   generateCheckList 가 순수 함수라 사용자 식별 정보가 입력에 없기 때문.
--   성향을 한 번 물어 저장해 두고, 생성 시점에 반영해 애초에 덜 만든다.
--
-- 값의 3상태
--   NULL      아직 안 물어봄  → 마법사에 질문 단계를 렌더하는 트리거
--   'minimal' 간소한 목록     → 고정 카테고리의 optional 등급을 생성하지 않음
--   'full'    전체 목록       → 현재 동작과 동일
--
--   기본값을 두지 않는 것이 핵심이다. DEFAULT 'full' 로 깔면 기존 사용자에게
--   영원히 묻지 않게 되어 기능이 아무에게도 닿지 않는다.
--
-- enum 이 아니라 text + CHECK 인 이유
--   등급을 3단계(간소/보통/넉넉히)로 늘리는 안이 열려 있다. Postgres enum 은
--   값 추가가 ALTER TYPE ADD VALUE 라 트랜잭션 제약이 있고 값 제거가 불가능하다.
--   변경 빈도가 높을 컬럼이므로 profiles.tier 의 enum 패턴을 따르지 않는다.
--
-- 주의 — 컬럼 단위 UPDATE 권한
--   20260801000000_s_payment_hardening 에서 셀프-프리미엄을 막으려고
--   REVOKE UPDATE ON profiles FROM authenticated 후
--   GRANT UPDATE (email, username) 로 화이트리스트를 걸었다.
--   즉 컬럼만 추가하면 클라이언트는 이 값을 **쓸 수 없고, 조용히 실패한다**.
--   아래 GRANT 가 이 마이그레이션의 핵심이다.
--
-- 운영 반영: 대시보드 SQL 에디터에서 직접 실행. 재실행 안전(멱등).
-- =====================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS packing_style text;

-- CHECK 는 ADD CONSTRAINT IF NOT EXISTS 를 지원하지 않아 DO 블록으로 감싼다.
-- NULL 은 CHECK 가 NULL(=통과)로 평가하므로 "아직 안 물어봄" 상태가 허용된다.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_packing_style_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_packing_style_check
      CHECK (packing_style IN ('minimal', 'full'));
  END IF;
END $$;

-- 본인 행만 수정하는 RLS('본인 프로필만 수정 가능', id = auth.uid())는 이미 있다.
-- 여기서는 컬럼 화이트리스트에 packing_style 을 추가한다.
GRANT UPDATE (packing_style) ON public.profiles TO authenticated;

COMMENT ON COLUMN public.profiles.packing_style IS
  '짐 스타일. NULL=아직 안 물어봄(질문 트리거) / minimal=간소한 목록 / full=전체 목록';
