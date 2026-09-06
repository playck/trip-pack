# RLS 정책 목록

카탈로그(pg_policies)에서 생성한 목록입니다. 손으로 고치지 말고 아래 쿼리로 다시 만듭니다.

생성일: 2026-09-06 (마이그레이션 20260906000012 적용 후)

```sql
select tablename, cmd, policyname, roles, qual, with_check from pg_policies where schemaname = 'public' order by 1, 2;
```

읽는 법

- 같은 (테이블, 명령)의 정책은 OR 로 합쳐집니다. 지금은 (테이블, 명령)마다 정책이 하나뿐입니다.
- 정책이 없는 명령은 전부 거부입니다. trip_members 의 INSERT 와 trips 의 INSERT 가 없는 것은 의도된 것입니다 (RPC 만 추가).
- 정책은 행 단위라 컬럼을 제한하지 못합니다. trips 는 멤버도 UPDATE 할 수 있지만, 메모 외의 컬럼은 trips_enforce_update_scope 트리거가 방장으로 제한합니다.
- 이름 규칙: <table>_<cmd> 또는 <table>_<cmd>_<의도>. auth.uid() 는 항상 (select auth.uid()) 로 감쌉니다.

| 테이블 | 명령 | 정책 | 역할 | USING | WITH CHECK |
|---|---|---|---|---|---|
 |  admin_audit_log | SELECT | admin_audit_log_select | public | (EXISTS ( SELECT 1 FROM admin_users WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))) |  |
 |  admin_users | SELECT | admin_users_select | public | (( SELECT auth.uid() AS uid) = user_id) |  |
 |  checklist_categories | DELETE | checklist_categories_delete | public | (created_by = ( SELECT auth.uid() AS uid)) |  |
 |  checklist_categories | INSERT | checklist_categories_insert | public |  | ((created_by = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1 FROM trip_members WHERE ((trip_members.trip_id = checklist_categories.trip_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid)))))) |
 |  checklist_categories | SELECT | checklist_categories_select | public | ((created_by = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1 FROM trip_members WHERE ((trip_members.trip_id = checklist_categories.trip_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid)))))) |  |
 |  checklist_categories | UPDATE | checklist_categories_update | public | (created_by = ( SELECT auth.uid() AS uid)) | (created_by = ( SELECT auth.uid() AS uid)) |
 |  checklist_items | DELETE | checklist_items_delete | public | (EXISTS ( SELECT 1 FROM checklist_categories cc WHERE ((cc.id = checklist_items.category_id) AND (cc.created_by = ( SELECT auth.uid() AS uid))))) |  |
 |  checklist_items | INSERT | checklist_items_insert | public |  | (EXISTS ( SELECT 1 FROM checklist_categories cc WHERE ((cc.id = checklist_items.category_id) AND (cc.created_by = ( SELECT auth.uid() AS uid))))) |
 |  checklist_items | SELECT | checklist_items_select | public | (EXISTS ( SELECT 1 FROM checklist_categories cc WHERE ((cc.id = checklist_items.category_id) AND (cc.created_by = ( SELECT auth.uid() AS uid))))) |  |
 |  checklist_items | UPDATE | checklist_items_update | public | (EXISTS ( SELECT 1 FROM checklist_categories cc WHERE ((cc.id = checklist_items.category_id) AND (cc.created_by = ( SELECT auth.uid() AS uid))))) | (EXISTS ( SELECT 1 FROM checklist_categories cc WHERE ((cc.id = checklist_items.category_id) AND (cc.created_by = ( SELECT auth.uid() AS uid))))) |
 |  checklist_templates | DELETE | checklist_templates_delete | public | (( SELECT auth.uid() AS uid) = user_id) |  |
 |  checklist_templates | INSERT | checklist_templates_insert | public |  | (( SELECT auth.uid() AS uid) = user_id) |
 |  checklist_templates | SELECT | checklist_templates_select | public | ((( SELECT auth.uid() AS uid) = user_id) OR (is_public = true)) |  |
 |  checklist_templates | UPDATE | checklist_templates_update | public | (( SELECT auth.uid() AS uid) = user_id) | (( SELECT auth.uid() AS uid) = user_id) |
 |  payment_events | SELECT | payment_events_select | public | (( SELECT auth.uid() AS uid) = user_id) |  |
 |  profiles | SELECT | profiles_select | public | ((id = ( SELECT auth.uid() AS uid)) OR (id IN ( SELECT tm.user_id FROM trip_members tm WHERE (tm.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids))))) |  |
 |  profiles | UPDATE | profiles_update | public | (id = ( SELECT auth.uid() AS uid)) |  |
 |  shopping_categories | DELETE | shopping_categories_delete | public | (created_by = ( SELECT auth.uid() AS uid)) |  |
 |  shopping_categories | INSERT | shopping_categories_insert_member_self | authenticated |  | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  shopping_categories | SELECT | shopping_categories_select | public | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND ((is_shared = true) OR (created_by = ( SELECT auth.uid() AS uid)))) |  |
 |  shopping_categories | UPDATE | shopping_categories_update | public | (created_by = ( SELECT auth.uid() AS uid)) |  |
 |  shopping_items | DELETE | shopping_items_delete | public | (category_id IN ( SELECT shopping_categories.id FROM shopping_categories WHERE ((shopping_categories.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND ((shopping_categories.is_shared = true) OR (shopping_categories.created_by = ( SELECT auth.uid() AS uid)))))) |  |
 |  shopping_items | INSERT | shopping_items_insert | public |  | (category_id IN ( SELECT shopping_categories.id FROM shopping_categories WHERE ((shopping_categories.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND ((shopping_categories.is_shared = true) OR (shopping_categories.created_by = ( SELECT auth.uid() AS uid)))))) |
 |  shopping_items | SELECT | shopping_items_select | public | (category_id IN ( SELECT shopping_categories.id FROM shopping_categories WHERE ((shopping_categories.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND ((shopping_categories.is_shared = true) OR (shopping_categories.created_by = ( SELECT auth.uid() AS uid)))))) |  |
 |  shopping_items | UPDATE | shopping_items_update | public | (category_id IN ( SELECT shopping_categories.id FROM shopping_categories WHERE ((shopping_categories.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND ((shopping_categories.is_shared = true) OR (shopping_categories.created_by = ( SELECT auth.uid() AS uid)))))) |  |
 |  template_categories | ALL | template_categories_all | public | (template_id IN ( SELECT checklist_templates.id FROM checklist_templates WHERE (checklist_templates.user_id = ( SELECT auth.uid() AS uid)))) | (template_id IN ( SELECT checklist_templates.id FROM checklist_templates WHERE (checklist_templates.user_id = ( SELECT auth.uid() AS uid)))) |
 |  template_items | ALL | template_items_all | public | (category_id IN ( SELECT tc.id FROM (template_categories tc JOIN checklist_templates ct ON ((ct.id = tc.template_id))) WHERE (ct.user_id = ( SELECT auth.uid() AS uid)))) | (category_id IN ( SELECT tc.id FROM (template_categories tc JOIN checklist_templates ct ON ((ct.id = tc.template_id))) WHERE (ct.user_id = ( SELECT auth.uid() AS uid)))) |
 |  todo_categories | DELETE | todo_categories_delete | public | (EXISTS ( SELECT 1 FROM trip_members WHERE ((trip_members.trip_id = todo_categories.trip_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_categories | INSERT | todo_categories_insert_member_self | authenticated |  | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  todo_categories | SELECT | todo_categories_select | public | (EXISTS ( SELECT 1 FROM trip_members WHERE ((trip_members.trip_id = todo_categories.trip_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_categories | UPDATE | todo_categories_update | public | (EXISTS ( SELECT 1 FROM trip_members WHERE ((trip_members.trip_id = todo_categories.trip_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_item_assignees | DELETE | todo_item_assignees_delete | public | (EXISTS ( SELECT 1 FROM ((todo_items JOIN todo_categories ON ((todo_categories.id = todo_items.category_id))) JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_items.id = todo_item_assignees.todo_item_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_item_assignees | INSERT | todo_item_assignees_insert | public |  | (EXISTS ( SELECT 1 FROM ((todo_items JOIN todo_categories ON ((todo_categories.id = todo_items.category_id))) JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_items.id = todo_item_assignees.todo_item_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |
 |  todo_item_assignees | SELECT | todo_item_assignees_select | public | (EXISTS ( SELECT 1 FROM ((todo_items JOIN todo_categories ON ((todo_categories.id = todo_items.category_id))) JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_items.id = todo_item_assignees.todo_item_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_items | DELETE | todo_items_delete | public | (EXISTS ( SELECT 1 FROM (todo_categories JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_categories.id = todo_items.category_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_items | INSERT | todo_items_insert_member_self | authenticated |  | ((category_id IN ( SELECT todo_categories.id FROM todo_categories WHERE (todo_categories.trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)))) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  todo_items | SELECT | todo_items_select | public | (EXISTS ( SELECT 1 FROM (todo_categories JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_categories.id = todo_items.category_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  todo_items | UPDATE | todo_items_update | public | (EXISTS ( SELECT 1 FROM (todo_categories JOIN trip_members ON ((trip_members.trip_id = todo_categories.trip_id))) WHERE ((todo_categories.id = todo_items.category_id) AND (trip_members.user_id = ( SELECT auth.uid() AS uid))))) |  |
 |  trip_expenses | DELETE | trip_expenses_delete | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_expenses | INSERT | trip_expenses_insert_member_self | authenticated |  | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  trip_expenses | SELECT | trip_expenses_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_expenses | UPDATE | trip_expenses_update | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_flights | DELETE | trip_flights_delete | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_flights | INSERT | trip_flights_insert | public |  | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |
 |  trip_flights | SELECT | trip_flights_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_flights | UPDATE | trip_flights_update | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_invitations | DELETE | trip_invitations_delete_creator_or_owner | authenticated | ((created_by = ( SELECT auth.uid() AS uid)) OR (trip_id IN ( SELECT get_my_owned_trip_ids() AS get_my_owned_trip_ids))) |  |
 |  trip_invitations | INSERT | trip_invitations_insert_member_self | authenticated |  | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  trip_invitations | SELECT | trip_invitations_select_member | authenticated | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_invitations | UPDATE | trip_invitations_update_creator_or_owner | authenticated | ((created_by = ( SELECT auth.uid() AS uid)) OR (trip_id IN ( SELECT get_my_owned_trip_ids() AS get_my_owned_trip_ids))) | ((created_by = ( SELECT auth.uid() AS uid)) OR (trip_id IN ( SELECT get_my_owned_trip_ids() AS get_my_owned_trip_ids))) |
 |  trip_members | DELETE | trip_members_delete_owner_or_self | authenticated | ((role <> 'owner'::text) AND ((trip_id IN ( SELECT get_my_owned_trip_ids() AS get_my_owned_trip_ids)) OR (user_id = ( SELECT auth.uid() AS uid)))) |  |
 |  trip_members | SELECT | trip_members_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_reservations | DELETE | trip_reservations_delete | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_reservations | INSERT | trip_reservations_insert_member_self | authenticated |  | ((trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) AND (created_by = ( SELECT auth.uid() AS uid))) |
 |  trip_reservations | SELECT | trip_reservations_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_reservations | UPDATE | trip_reservations_update | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_schedules | DELETE | trip_schedules_delete | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_schedules | INSERT | trip_schedules_insert | public |  | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |
 |  trip_schedules | SELECT | trip_schedules_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_schedules | UPDATE | trip_schedules_update | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_wishlists | DELETE | trip_wishlists_delete | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_wishlists | INSERT | trip_wishlists_insert | public |  | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |
 |  trip_wishlists | SELECT | trip_wishlists_select | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trip_wishlists | UPDATE | trip_wishlists_update | public | (trip_id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trips | DELETE | trips_delete | public | (user_id = ( SELECT auth.uid() AS uid)) |  |
 |  trips | SELECT | trips_select | public | (id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |  |
 |  trips | UPDATE | trips_update | authenticated | (id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) | (id IN ( SELECT get_my_trip_ids() AS get_my_trip_ids)) |

## 정책 밖에서 권한을 지키는 것들

| 대상 | 장치 | 규칙 |
|---|---|---|
| trips 컬럼 범위 | trips_enforce_update_scope 트리거 | 멤버는 memo 만, 방장은 전부 (제목·예산·이미지·기간은 방장 특권) |
| 여행 기간 | update_trip_dates RPC | 방장만. 삭제·재계산·기간갱신을 한 트랜잭션으로 |
| 소유권 이전 | transfer_trip_ownership RPC | 방장만. 강등→승격→trips.user_id 순서 |
| 멤버 추가 | accept_invitation / create_trip_with_checklist RPC | 클라이언트 INSERT 정책 없음 |
| owner 멤버 행 삭제 | trip_members_forbid_owner_delete 트리거 | 여행·프로필이 살아 있으면 거부 |
| created_by 변경 | *_created_by_immutable 트리거 6개 | 작성자 컬럼 불변 |
