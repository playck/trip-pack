-- 운영 SQL 에디터에 그대로 붙여넣어 실행. 결과의 "판정" 이 전부 OK 여야 진행한다.
select * from (
  select 1 as 순번, 'PostgreSQL 15 이상' as 항목, version() as 값,
         case when current_setting('server_version_num')::int >= 150000 then 'OK' else '중단: 000005 의 SET NULL (컬럼) 문법 불가' end as 판정
  union all
  select 2, '선행: trip_wishlists 테이블', coalesce(to_regclass('public.trip_wishlists')::text,'없음'),
         case when to_regclass('public.trip_wishlists') is null then '중단: 20260815000000 먼저 실행' else 'OK' end
  union all
  select 3, '선행: convert_wishlist_to_schedule 함수',
         coalesce((select 'exists' from pg_proc where proname='convert_wishlist_to_schedule' limit 1),'없음'),
         case when not exists (select 1 from pg_proc where proname='convert_wishlist_to_schedule') then '중단: 20260822000000 먼저 실행' else 'OK' end
  union all
  select 4, '참고: trip_reservations 테이블', coalesce(to_regclass('public.trip_reservations')::text,'아직 없음 (정상)'),
         'OK (오늘 파일들은 이 테이블을 건드리지 않는다. 예약 기능 배포 때 20260905000000 을 나중에 실행)'
  union all
  select 5, '000003: user_id 가 NULL 인 여행', (select count(*) from public.trips where user_id is null)::text,
         case when exists (select 1 from public.trips where user_id is null) then '확인 필요: owner 멤버로 자동 보정되며 못 채우면 실패' else 'OK' end
  union all
  select 6, '000003: owner 가 없는 여행',
         (select count(*) from public.trips t where not exists (select 1 from public.trip_members m where m.trip_id=t.id and m.role='owner'))::text,
         case when exists (select 1 from public.trips t where not exists (select 1 from public.trip_members m where m.trip_id=t.id and m.role='owner')) then '중단: 데이터 정리 먼저' else 'OK' end
  union all
  select 7, '000003: owner 가 2명 이상인 여행',
         (select count(*) from (select trip_id from public.trip_members where role='owner' group by trip_id having count(*)>1) s)::text,
         case when exists (select 1 from (select trip_id from public.trip_members where role='owner' group by trip_id having count(*)>1) s) then '중단: 유니크 인덱스 생성 실패' else 'OK' end
  union all
  select 8, '000003: trips.user_id 와 owner 멤버 불일치',
         (select count(*) from public.trips t join public.trip_members m on m.trip_id=t.id and m.role='owner' where m.user_id<>t.user_id)::text,
         case when exists (select 1 from public.trips t join public.trip_members m on m.trip_id=t.id and m.role='owner' where m.user_id<>t.user_id) then '확인 필요: 소유권 기준이 어긋난 여행' else 'OK' end
  union all
  select 9, '000005: 필수 FK 의 NULL 행',
         ((select count(*) from public.checklist_categories where trip_id is null)
        + (select count(*) from public.checklist_items where category_id is null)
        + (select count(*) from public.checklist_templates where user_id is null))::text,
         case when (select count(*) from public.checklist_categories where trip_id is null)
                 + (select count(*) from public.checklist_items where category_id is null)
                 + (select count(*) from public.checklist_templates where user_id is null) > 0
              then '중단: NOT NULL 설정 실패' else 'OK' end
  union all
  select 10, '000005: 다른 여행 일정에 연결된 경비',
         (select count(*) from public.trip_expenses e join public.trip_schedules s on s.id=e.schedule_id where s.trip_id<>e.trip_id)::text,
         'OK (있으면 마이그레이션이 연결만 끊는다)'
  union all
  select 11, '000009: 같은 (테이블,명령) 에 정책 2개 이상',
         (select coalesce(string_agg(tablename||'.'||cmd, ', '), '없음')
            from (select tablename, cmd from pg_policies where schemaname='public' group by 1,2 having count(*)>1) s)::text,
         'trip_invitations 만 나오면 OK (000002 가 정리함). 다른 게 있으면 중단'
) x order by 순번;
