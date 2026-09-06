-- =====================================================================
-- anon 역할 권한 회수 (최소 권한)
--
-- 배경
--   모든 테이블에 GRANT ALL ... TO anon 이 걸려 있어 비로그인 키로도 INSERT/UPDATE/DELETE/TRUNCATE 권한이 있었다.
--   RLS 가 실제 접근을 전부 막고 있어(정책이 모두 auth.uid() 나 멤버십을 요구) 지금 새는 곳은 없지만,
--   RLS 가 꺼진 테이블이 하나라도 생기면 anon 키로 그대로 읽힌다. anon 키는 앱 번들에 들어 있어 누구나 가진다.
--   앱은 로그인 전에 auth 만 쓰고 DB 를 읽지 않는다 (login / signup / invite 라우트 확인).
--   클라이언트 RPC 도 PUBLIC(=모든 역할)에 EXECUTE 가 열려 있어 anon 이 호출할 수 있었다.
--
-- 변경
--   1) public 스키마의 기존 테이블·시퀀스에서 anon 권한 회수
--   2) 클라이언트 RPC 에서 PUBLIC 과 anon 의 EXECUTE 회수 (authenticated / service_role 명시 부여는 유지)
--      트리거 함수는 실행 시점에 EXECUTE 검사가 없어 영향이 없지만(로컬 실험으로 확인), 클라이언트가 부를 이유가 없으니 함께 회수한다.
--      함수의 기본 권한은 PUBLIC 도 함께 빼야 한다. anon 만 빼면 새 함수에 PUBLIC 실행 권한(=X)이 여전히 붙는다(로컬 실험으로 확인).
--   3) 앞으로 postgres 가 만드는 객체에 anon 이 기본 부여되지 않도록 기본 권한 수정
--      (Supabase 는 ALTER DEFAULT PRIVILEGES 로 새 객체에 anon/authenticated/service_role 을 자동 부여한다)
--
-- 되돌리기: GRANT 를 다시 하면 된다. 운영 반영: REVOKE 는 없는 권한을 빼도 오류가 아니라 재실행 안전.
-- =====================================================================

-- 1) 기존 테이블·시퀀스 --------------------------------------------------------
REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- 2) 함수 ------------------------------------------------------------------------
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC, anon;

-- 3) 앞으로 만들 객체의 기본 권한 ---------------------------------------------------
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES    FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC, anon;
