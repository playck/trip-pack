-- =====================================================================
-- updated_at 자동 갱신 트리거를 컬럼이 있는 모든 테이블에 붙인다
--
-- 배경
--   updated_at 컬럼은 8개 테이블에 있는데 트리거는 checklist_templates 하나에만 걸려 있었다.
--   trip_reservations 는 운영에 아직 없는 개발 중 테이블이라 여기서 빼고,
--   20260905000000_trip_reservations.sql 안에 같은 트리거를 두었다.
--   나머지는 클라이언트가 기억날 때만 updated_at 을 보내고 있어(예약·쇼핑·할일은 보내고, 일정·경비는 안 보냄)
--   값이 신뢰할 수 없었다. "언제 마지막으로 바뀌었나"는 DB 가 찍어야 한다.
--
--   WHEN (OLD.* IS DISTINCT FROM NEW.*): 실제로 값이 바뀐 UPDATE 에만 찍는다.
--   클라이언트가 updated_at 을 보내도 트리거가 NOW() 로 덮어쓰므로 클라이언트 코드는 그대로 두어도 된다.
--
-- 운영 반영: CREATE OR REPLACE TRIGGER (PG14+) 라 재실행 안전.
-- =====================================================================

CREATE OR REPLACE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_shopping_items_updated_at
  BEFORE UPDATE ON public.shopping_items
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_todo_items_updated_at
  BEFORE UPDATE ON public.todo_items
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_trip_expenses_updated_at
  BEFORE UPDATE ON public.trip_expenses
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_trip_schedules_updated_at
  BEFORE UPDATE ON public.trip_schedules
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_trip_wishlists_updated_at
  BEFORE UPDATE ON public.trip_wishlists
  FOR EACH ROW WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.update_updated_at_column();
