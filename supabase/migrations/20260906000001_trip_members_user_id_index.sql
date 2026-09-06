-- =====================================================================
-- trip_members: user_id 선행 인덱스 추가 + 중복 유니크 인덱스 제거
--
-- 배경
--   get_my_trip_ids() 는 `SELECT trip_id FROM trip_members WHERE user_id = auth.uid()` 를 실행한다.
--   RLS 정책 69개 중 32개가 이 함수를 거치고, 메인 화면도 RPC 로 직접 호출한다.
--   그런데 trip_members 의 인덱스는 (trip_id, user_id) 복합뿐이라, user_id 단독 조건은
--   선행 컬럼 규칙(leftmost prefix) 때문에 인덱스로 찾을 수 없어 테이블 전체를 훑는다.
--   지금은 행이 적어 티가 안 나지만 모든 요청이 통과하는 지점이다.
--
-- 변경
--   1) (user_id, trip_id) 인덱스 추가
--      조건 컬럼(user_id)과 SELECT 컬럼(trip_id)이 모두 들어 있어 테이블을 건드리지 않는
--      Index Only Scan 이 가능하다.
--   2) idx_trip_members_trip_user 제거
--      UNIQUE 제약 trip_members_trip_id_user_id_key 가 만든 인덱스와 정의가 완전히 같은 중복이다.
--      읽기 이득은 없고 INSERT/DELETE 마다 인덱스를 두 번 갱신하는 비용만 든다.
--      제약과 그 인덱스는 그대로 남으므로 (trip_id, user_id) 조회와 유니크 보장은 유지된다.
--
-- 운영 반영
--   SQL 에디터에서 그대로 실행. IF NOT EXISTS / IF EXISTS 라 재실행 안전.
--   trip_members 는 작아서 일반 CREATE INDEX 로 충분하다(쓰기 잠금 수 ms).
--   행이 수십만 건이 넘는 테이블에 인덱스를 만들 때는 CREATE INDEX CONCURRENTLY 를
--   트랜잭션 밖에서 단독 실행한다. migration up 과 SQL 에디터의 다중 문장은 하나의 트랜잭션으로
--   묶이므로 그 안에서는 CONCURRENTLY 가 실패한다.
-- =====================================================================

CREATE INDEX IF NOT EXISTS trip_members_user_id_trip_id_idx
  ON public.trip_members (user_id, trip_id);

DROP INDEX IF EXISTS public.idx_trip_members_trip_user;

COMMENT ON INDEX public.trip_members_user_id_trip_id_idx IS
  'Hot path for get_my_trip_ids() (user_id = auth.uid()) used by most RLS policies. Covers trip_id for index-only scans.';
