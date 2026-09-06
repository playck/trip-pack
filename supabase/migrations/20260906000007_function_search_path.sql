-- =====================================================================
-- 함수 search_path 고정
--
-- 배경
--   get_my_trip_ids / get_my_owned_trip_ids / handle_new_user 는 SECURITY DEFINER(소유자 postgres 권한으로 실행)
--   인데 search_path 가 고정되어 있지 않다. search_path 가 호출자 세션을 따르면, 같은 이름의 객체를 앞 순서
--   스키마에 만들어 두는 식으로 함수가 엉뚱한 테이블·함수를 참조하게 만들 수 있다 (search_path 하이재킹).
--   Supabase 린터도 function_search_path_mutable 로 경고한다. 나중에 만든 함수들은 모두 SET search_path 가 있다.
--   SECURITY INVOKER 함수(get_trips_with_check_progress, update_updated_at_column)도 린터 대상이라 함께 고정한다.
--
--   본문이 trips, trip_members 처럼 스키마 없이 테이블을 쓰므로 '' 가 아니라 public 으로 고정한다
--   (이 저장소의 다른 함수들과 같은 방식). auth.uid() 는 스키마가 붙어 있어 영향이 없다.
--
-- 운영 반영: ALTER FUNCTION 은 재실행해도 같은 결과.
-- =====================================================================

ALTER FUNCTION public.get_my_trip_ids()                    SET search_path = public;
ALTER FUNCTION public.get_my_owned_trip_ids()              SET search_path = public;
ALTER FUNCTION public.handle_new_user()                    SET search_path = public;
ALTER FUNCTION public.update_updated_at_column()           SET search_path = public;
ALTER FUNCTION public.get_trips_with_check_progress(uuid)  SET search_path = public;
