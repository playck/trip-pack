-- =====================================================================
-- 작성자 불변 트리거: 회원 탈퇴 CASCADE(SET NULL)는 통과시킨다
--
-- 문제
--   20260906000002 의 forbid_created_by_change 는 created_by 의 모든 변경을 거부한다.
--   FK 의 ON DELETE SET NULL 도 내부적으로 UPDATE 라서 같이 막힌다.
--   → 경비·할 일을 한 번이라도 쓴 사용자는 auth.users 삭제(회원 탈퇴)가 통째로 실패한다.
--
-- 해결
--   forbid_owner_member_delete 와 같은 방식: 작성자 프로필이 이미 지워진 상태에서
--   NULL 로 바뀌는 경우만 허용한다. 프로필이 살아 있으면(일반 사용자 UPDATE) 여전히 거부.
--
-- 운영 반영: SQL 에디터에서 그대로 실행. CREATE OR REPLACE 라 재실행 안전. 트리거 재생성 불필요.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.forbid_created_by_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.created_by IS DISTINCT FROM OLD.created_by
     AND NOT (NEW.created_by IS NULL
              AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = OLD.created_by))  -- 회원 탈퇴 SET NULL
  THEN
    RAISE EXCEPTION 'created_by is immutable' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;
