-- 회원가입(auth.users INSERT) 시 public.profiles 행을 자동 생성하는 트리거 복원.
--
-- 배경: 초기 스키마는 `supabase db dump`(public 스키마 전용)로 생성되어,
--       auth.users 에 걸려 있던 이 트리거가 로컬/협업 환경에 누락됨.
--       그 결과 회원가입해도 profile 이 안 생겨 trips/trip_members FK 위반(409) 발생.
-- 참고: handle_new_user() 함수 자체는 public 스키마라 초기 마이그레이션에 이미 포함됨.
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
