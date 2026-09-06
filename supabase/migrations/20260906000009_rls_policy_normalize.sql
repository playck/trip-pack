-- =====================================================================
-- 옛 RLS 정책 정규화: auth.uid() 를 (select auth.uid()) 로 감싸고, 이름을 <table>_<cmd> 로 통일
--
-- 배경
--   초기 정책 40여 개가 auth.uid() 를 그대로 쓴다. 정책 안의 함수 호출은 행마다 재평가될 수 있어
--   (select auth.uid()) 로 감싸 문장당 한 번만 평가되게 하는 것이 Supabase 권장이다 (security-rls-performance).
--   이름은 한글·영문·줄바꿈이 섞여 있어 DROP POLICY 가 위험했다. <table>_<cmd> 로 통일한다.
--
-- 방법
--   40개를 손으로 다시 쓰면 오타 하나로 의미가 바뀔 수 있다. 대신 카탈로그(pg_policies)에서 현재 정의를 읽어
--   auth.uid() 만 치환하고 역할·명령·USING·WITH CHECK 는 그대로 옮긴다.
--   auth.uid() 를 안 쓰고 get_my_trip_ids() 만 쓰는 정책(경비·일정·항공·위시·예약 등)도 이름이 한글이면
--   식은 그대로 두고 이름만 <table>_<cmd> 로 옮긴다.
--   이미 감싼 정책(20260906000002~4 에서 만든 것)은 건너뛴다. 재실행하면 대상이 없어 아무 일도 하지 않는다.
--   의미가 바뀌지 않았는지는 적용 전후 정의를 정규화해 diff 로 검증했다 (검증 절차는 아래 주석).
--
-- 안전장치
--   - 같은 (테이블, 명령)에 정책이 둘 이상이면 이름이 겹치므로 시작 전에 실패시킨다.
--   - DO 블록은 한 트랜잭션이라 중간 실패 시 전부 원상복구된다.
--
-- 검증 절차 (적용 전후 각각 실행해 결과를 비교, 차이가 없어야 한다)
--   select tablename, cmd, roles, permissive,
--     case when coalesce(qual,'') ~ 'SELECT auth\.uid' then qual
--          else replace(qual, 'auth.uid()', '( SELECT auth.uid() AS uid)') end,
--     case when coalesce(with_check,'') ~ 'SELECT auth\.uid' then with_check
--          else replace(with_check, 'auth.uid()', '( SELECT auth.uid() AS uid)') end
--   from pg_policies where schemaname = 'public' order by 1, 2;
-- =====================================================================

DO $$
DECLARE
  p       record;
  v_name  text;
  v_qual  text;
  v_check text;
  v_sql   text;
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
    GROUP BY tablename, cmd HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Multiple policies exist for the same (table, cmd). Merge them before normalizing names.';
  END IF;

  FOR p IN
    SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        -- (a) 이름이 snake_case 가 아닌 것 (한글·공백·줄바꿈). 식은 그대로 옮기고 이름만 바꾼다.
        policyname !~ '^[a-z0-9_]+$'
        -- (b) auth.uid() 를 감싸지 않은 것
        OR (
          (coalesce(qual, '') || coalesce(with_check, '')) ~ 'auth\.uid\(\)'
          AND (coalesce(qual, '') || coalesce(with_check, '')) !~ 'SELECT auth\.uid\(\)'
        )
      )
    ORDER BY tablename, cmd
  LOOP
    v_name  := p.tablename || '_' || lower(p.cmd);
    -- 이미 감싼 식은 건드리지 않는다 (이중 감싸기 방지)
    v_qual  := CASE WHEN coalesce(p.qual, '')       ~ 'SELECT auth\.uid' THEN p.qual
                    ELSE replace(p.qual,       'auth.uid()', '(select auth.uid())') END;
    v_check := CASE WHEN coalesce(p.with_check, '') ~ 'SELECT auth\.uid' THEN p.with_check
                    ELSE replace(p.with_check, 'auth.uid()', '(select auth.uid())') END;

    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);

    v_sql := format(
      'CREATE POLICY %I ON public.%I AS %s FOR %s TO %s',
      v_name, p.tablename, p.permissive, p.cmd, array_to_string(p.roles, ', ')
    );
    IF v_qual  IS NOT NULL THEN v_sql := v_sql || format(' USING (%s)', v_qual);       END IF;
    IF v_check IS NOT NULL THEN v_sql := v_sql || format(' WITH CHECK (%s)', v_check); END IF;

    EXECUTE v_sql;
    RAISE NOTICE 'normalized: % → %', p.policyname, v_name;
  END LOOP;
END $$;
