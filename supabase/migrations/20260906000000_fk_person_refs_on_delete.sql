-- =====================================================================
-- 사람(profiles / auth.users) 참조 FK 의 ON DELETE 정정
--
-- 배경
--   아래 컬럼들이 ON DELETE NO ACTION 이라, 공유 여행에 짐 카테고리·경비·초대 등을
--   한 건이라도 남긴 사용자는 auth.users 삭제(회원 탈퇴)가 FK 위반으로 실패한다.
--   (로컬 재현: checklist_categories_created_by_fkey, trip_expenses_created_by_fkey
--    위반으로 DELETE FROM auth.users 실패)
--
-- 원칙 — 컬럼이 "누구의 것"인지에 따라 하나의 규칙만 고른다
--   1) 그 사람만의 것 (개인 짐목록, 본인이 만든 초대)      → CASCADE  : 주인이 떠나면 같이 삭제
--   2) 여행 공유 자산의 작성자 표시 (경비·쇼핑·할일·체크) → SET NULL : 데이터는 남기고 작성자만 비움
--   3) 감사 로그 (admin_audit_log)                       → FK 제거  : 기록은 사람과 무관하게 영구 보존
--   4) 외부 결제 이벤트 (payment_events)                  → FK 제거  : RevenueCat 이 보낸 사실의 기록,
--                                                                    사용자 존재 여부와 무관하게 보존
--
--   trip_reservations.created_by 는 처음부터 SET NULL 이라 변경 없음.
--   todo_categories.created_by / todo_items.checked_by 도 이미 SET NULL.
--
-- 운영 반영
--   대시보드 SQL 에디터에서 그대로 실행한다. DROP IF EXISTS → ADD 순서라 두 번 실행해도 안전하다.
--   ADD CONSTRAINT 는 기존 행 전체를 검증하며 그동안 양쪽 테이블에 잠금을 잡는다.
--   지금은 테이블이 작아 무시해도 되지만, 행이 수십만 건이 넘는 테이블이라면
--   ADD CONSTRAINT ... NOT VALID 로 먼저 걸고 VALIDATE CONSTRAINT 를 따로 실행한다.
-- =====================================================================

-- 1) 그 사람만의 것 → CASCADE ------------------------------------------

-- 짐 카테고리는 RLS 가 created_by = auth.uid() 로 묶인 개인 목록이다.
-- 주인이 사라지면 볼 사람이 없으므로 카테고리와 (category_id CASCADE 로) 아이템까지 함께 지운다.
ALTER TABLE public.checklist_categories
  DROP CONSTRAINT IF EXISTS checklist_categories_created_by_fkey,
  ADD CONSTRAINT checklist_categories_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 초대는 UPDATE 정책이 "만든 사람만" 이라, 작성자를 NULL 로 비우면 아무도 비활성화할 수 없는
-- 유령 초대가 남는다. 작성자와 함께 지우는 편이 안전하다.
ALTER TABLE public.trip_invitations
  DROP CONSTRAINT IF EXISTS trip_invitations_created_by_fkey,
  ADD CONSTRAINT trip_invitations_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2) 공유 자산의 작성자 표시 → SET NULL ---------------------------------

-- 경비는 돈이 걸린 여행 공용 기록이다. 작성자가 떠나도 정산 합계가 바뀌면 안 된다.
ALTER TABLE public.trip_expenses
  DROP CONSTRAINT IF EXISTS trip_expenses_created_by_fkey,
  ADD CONSTRAINT trip_expenses_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 쇼핑 카테고리: is_shared = true 인 것은 남은 멤버가 계속 쓴다.
-- is_shared = false 인 개인 카테고리는 SET NULL 뒤 아무 정책에도 걸리지 않는 잔여 행이 되지만,
-- 여행 삭제 시 trip_id CASCADE 로 정리된다. 탈퇴 처리 함수에서 개인 데이터를 먼저 지우면 잔여도 없다.
ALTER TABLE public.shopping_categories
  DROP CONSTRAINT IF EXISTS shopping_categories_created_by_fkey,
  ADD CONSTRAINT shopping_categories_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.shopping_items
  DROP CONSTRAINT IF EXISTS shopping_items_checked_by_fkey,
  ADD CONSTRAINT shopping_items_checked_by_fkey
    FOREIGN KEY (checked_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.todo_items
  DROP CONSTRAINT IF EXISTS todo_items_created_by_fkey,
  ADD CONSTRAINT todo_items_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3) 감사 로그 → FK 제거 -------------------------------------------------

-- append-only 감사 기록은 "그때 누가 무엇을 했나"의 스냅샷이다. 대상 유저가 탈퇴해도,
-- 운영자 계정이 사라져도 행은 남아야 하므로 FK 로 삭제를 막지 않는다.
-- uuid 는 값으로만 보관하고, 조회용 인덱스(admin_audit_log_*_created_idx)는 그대로 둔다.
ALTER TABLE public.admin_audit_log
  DROP CONSTRAINT IF EXISTS admin_audit_log_admin_user_id_fkey,
  DROP CONSTRAINT IF EXISTS admin_audit_log_target_user_id_fkey;

COMMENT ON COLUMN public.admin_audit_log.admin_user_id IS
  'auth.users.id snapshot. Intentionally no FK: audit rows must survive account deletion.';
COMMENT ON COLUMN public.admin_audit_log.target_user_id IS
  'auth.users.id snapshot. Intentionally no FK: audit rows must survive account deletion.';

-- 4) 외부 결제 이벤트 → FK 제거 -----------------------------------------

-- 기존 ON DELETE CASCADE 는 탈퇴와 함께 결제 이력을 통째로 지웠다. 결제 기록은 환불 분쟁·정산 대조에
-- 필요하고 관련 법령상 보관 의무도 있어, 계정과 생사를 같이하면 안 된다.
-- FK 가 있으면 "기록하기"가 "사용자가 존재하기"에 종속된다. 웹훅이 23503 을 만나면 건너뛰는 분기가
-- 그 종속의 흔적이며, 탈퇴 뒤 도착한 환불 이벤트는 기록조차 남지 않았다. FK 를 없애면 그 분기는
-- 더 이상 타지 않고 이벤트가 그대로 기록된다.
-- user_id 는 RevenueCat app_user_id(= auth.users.id) 를 값으로 보관한다. NOT NULL 은 유지한다.
-- 탈퇴한 uuid 는 어떤 세션의 auth.uid() 와도 일치하지 않으므로 RLS(auth.uid() = user_id)로
-- 다른 사용자에게 노출될 길이 없다. 조회용 인덱스(payment_events_user_created_idx)는 그대로 둔다.
ALTER TABLE public.payment_events
  DROP CONSTRAINT IF EXISTS payment_events_user_id_fkey;

COMMENT ON COLUMN public.payment_events.user_id IS
  'RevenueCat app_user_id (= auth.users.id) snapshot. Intentionally no FK: payment records must survive account deletion and events may arrive after deletion.';
