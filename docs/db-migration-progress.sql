-- 오늘 마이그레이션 13개가 각각 적용됐는지 확인한다. 각 파일의 고유 산물을 본다.
-- "미적용" 인 것만 번호 순서대로 실행하면 된다. 전부 재실행 안전이라 헷갈리면 그냥 다시 실행해도 된다.
with c as (
  select
    (select count(*) from pg_constraint where conname='checklist_categories_created_by_fkey' and confdeltype='c') as m00_cascade,
    (select count(*) from pg_constraint where conname='payment_events_user_id_fkey')                              as m00_pay_fk,
    (select count(*) from pg_class where relname='trip_members_user_id_trip_id_idx')                              as m01_idx,
    (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname='forbid_created_by_change')                                         as m02_fn,
    (select count(*) from pg_policies where policyname='trip_expenses_insert_member_self')                        as m02_pol,
    (select count(*) from pg_class where relname='trip_members_one_owner_per_trip')                               as m03_idx,
    (select count(*) from information_schema.columns
       where table_schema='public' and table_name='trips' and column_name='user_id' and is_nullable='NO')         as m03_nn,
    (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname='transfer_trip_ownership')                                          as m04_fn,
    (select count(*) from pg_constraint where conname='trip_expenses_trip_schedule_fkey')                         as m05_fk,
    (select count(*) from information_schema.columns
       where table_schema='public' and table_name='checklist_categories' and column_name='trip_id' and is_nullable='NO') as m05_nn,
    (select count(*) from pg_class where relname='idx_expenses_trip_id')                                          as m06_old,
    (select count(*) from pg_class where relname='todo_items_created_by_idx')                                     as m06_new,
    (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname='get_my_trip_ids'
         and coalesce(array_to_string(p.proconfig,','),'') like '%search_path%')                                  as m07_sp,
    (select count(*) from pg_trigger where tgname='update_trip_schedules_updated_at' and not tgisinternal)        as m08_trg,
    (select count(*) from pg_policies where schemaname='public' and policyname !~ '^[a-z0-9_]+$')                 as m09_badname,
    (select count(*) from information_schema.role_table_grants
       where table_schema='public' and grantee='anon')                                                            as m10_anon,
    (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname='update_trip_dates')                                                as m11_fn,
    (select count(*) from pg_trigger where tgname='trips_enforce_update_scope' and not tgisinternal)              as m12_trg
)
select * from (
  select 0 as 순번, '20260905000000_trip_reservations' as 파일,
         case when to_regclass('public.trip_reservations') is not null then '적용됨' else '미적용' end as 상태,
         '실수로 먼저 실행됨. 위치만 앞당겨졌고 내용은 정상' as 비고 from c
  union all
  select 1, '20260906000000_fk_person_refs', case when m00_cascade>0 and m00_pay_fk=0 then '적용됨' else '미적용' end,
         'created_by CASCADE + payment_events FK 제거' from c
  union all
  select 2, '20260906000001_trip_members_index', case when m01_idx>0 then '적용됨' else '미적용' end,
         '(user_id, trip_id) 인덱스' from c
  union all
  select 3, '20260906000002_rls_attribution', case when m02_fn>0 and m02_pol>0 then '적용됨' else '미적용' end,
         '작성자 위조 차단 (예약 파일이 이걸 요구했음)' from c
  union all
  select 4, '20260906000003_ownership_invariants', case when m03_idx>0 and m03_nn>0 then '적용됨' else '미적용' end,
         '여행당 owner 1명 + user_id NOT NULL' from c
  union all
  select 5, '20260906000004_transfer_ownership_rpc', case when m04_fn>0 then '적용됨' else '미적용' end,
         '소유권 이전 RPC' from c
  union all
  select 6, '20260906000005_required_fks', case when m05_fk>0 and m05_nn>0 then '적용됨' else '미적용' end,
         '복합 FK + NOT NULL 3개' from c
  union all
  select 7, '20260906000006_index_cleanup', case when m06_old=0 and m06_new>0 then '적용됨' else '미적용' end,
         '중복 인덱스 정리' from c
  union all
  select 8, '20260906000007_function_search_path', case when m07_sp>0 then '적용됨' else '미적용' end,
         '함수 search_path 고정' from c
  union all
  select 9, '20260906000008_updated_at_triggers', case when m08_trg>0 then '적용됨' else '미적용' end,
         'updated_at 트리거' from c
  union all
  select 10, '20260906000009_policy_normalize', case when m09_badname=0 then '적용됨' else '미적용' end,
         '정책 이름 정규화' from c
  union all
  select 11, '20260906000010_revoke_anon', case when m10_anon=0 then '적용됨' else '미적용' end,
         'anon 권한 회수' from c
  union all
  select 12, '20260906000011_update_trip_dates_rpc', case when m11_fn>0 then '적용됨' else '미적용' end,
         '여행 기간 변경 RPC' from c
  union all
  select 13, '20260906000012_trip_update_scope', case when m12_trg>0 then '적용됨' else '미적용' end,
         '멤버는 메모만' from c
) x order by 순번;
