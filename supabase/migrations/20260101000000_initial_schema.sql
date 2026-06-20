

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."accept_invitation"("p_code" "text") RETURNS TABLE("out_trip_id" "uuid", "out_trip_title" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  declare
    v_inv public.trip_invitations%rowtype;
    v_uid uuid := auth.uid();
  begin
    if v_uid is null then
      raise exception 'unauthorized' using errcode = '42501';
    end if;

    select * into v_inv
    from public.trip_invitations
    where invite_code = p_code
      and coalesce(is_active, true) = true
      and (expires_at is null or expires_at > now())
    limit 1;

    if v_inv.id is null then
      raise exception 'invalid_or_expired_invitation';
    end if;

    insert into public.trip_members(trip_id, user_id, role)
    select v_inv.trip_id, v_uid, 'member'
    where not exists (
      select 1 from public.trip_members
      where trip_id = v_inv.trip_id and user_id = v_uid
    );

    return query
    select v_inv.trip_id, t.title
    from public.trips t
    where t.id = v_inv.trip_id;
  end;
  $$;


ALTER FUNCTION "public"."accept_invitation"("p_code" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_trip_with_checklist"("p_trip_data" "jsonb", "p_categories" "jsonb", "p_items" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  DECLARE
    v_trip_id UUID;
  BEGIN
    -- 인증 확인
    IF auth.uid() IS NULL THEN
      RAISE EXCEPTION '로그인이 필요합니다';
    END IF;

    -- 1. 여행 생성 (user_id는 위변조 방지 위해 auth.uid() 사용)
    INSERT INTO trips (
      title, start_date, end_date, region_id, region_name,
      country_code, companion_type, companion_types, trip_types, user_id
    )
    VALUES (
      p_trip_data->>'title',
      (p_trip_data->>'start_date')::DATE,
      (p_trip_data->>'end_date')::DATE,
      p_trip_data->>'region_id',
      p_trip_data->>'region_name',
      p_trip_data->>'country_code',
      p_trip_data->>'companion_type',
      p_trip_data->'companion_types',
      p_trip_data->'trip_types',
      auth.uid()
    )
    RETURNING id INTO v_trip_id;

      INSERT INTO trip_members (trip_id, user_id, role)
      VALUES (v_trip_id, auth.uid(), 'owner');

      -- 3. 카테고리 일괄 생성  (created_by 추가)
      INSERT INTO checklist_categories (
        id, name, icon_key, display_order, trip_id, created_by
      )
      SELECT
        (elem->>'id')::UUID,
        elem->>'name',
        elem->>'icon_key',
        (elem->>'display_order')::INT,
        v_trip_id,
        auth.uid()
      FROM jsonb_array_elements(p_categories) AS elem;

      -- 4. 아이템 일괄 생성
      INSERT INTO checklist_items (
        name, is_required, is_checked, notes,
        cabin_notes, cabin_policy, display_order, category_id
      )
      SELECT
        elem->>'name',
        (elem->>'is_required')::BOOLEAN,
        (elem->>'is_checked')::BOOLEAN,
        elem->>'notes',
        elem->>'cabin_notes',
        elem->>'cabin_policy',
        (elem->>'display_order')::INT,
        (elem->>'category_id')::UUID
      FROM jsonb_array_elements(p_items) AS elem;

      RETURN v_trip_id;
    END;
    $$;


ALTER FUNCTION "public"."create_trip_with_checklist"("p_trip_data" "jsonb", "p_categories" "jsonb", "p_items" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_owned_trip_ids"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT id FROM trips WHERE user_id =
  auth.uid()
  $$;


ALTER FUNCTION "public"."get_my_owned_trip_ids"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_trip_ids"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT trip_id FROM trip_members WHERE
  user_id = auth.uid()
  $$;


ALTER FUNCTION "public"."get_my_trip_ids"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_trips_with_check_progress"("p_user_id" "uuid") RETURNS TABLE("id" "uuid", "title" "text", "start_date" "date", "end_date" "date", "region_name" "text", "total_items" bigint, "checked_items" bigint, "progress_percentage" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.start_date,
    t.end_date,
    t.region_name,
    COALESCE(COUNT(ci.id), 0) as total_items,
    COALESCE(COUNT(CASE WHEN ci.is_checked = true THEN 1 END), 0) as checked_items,
    CASE 
      WHEN COUNT(ci.id) > 0 THEN 
        ROUND((COUNT(CASE WHEN ci.is_checked = true THEN 1 END) * 100.0) / COUNT(ci.id))::INTEGER
      ELSE 0 
    END as progress_percentage
  FROM trips t
  LEFT JOIN checklist_categories cc ON t.id = cc.trip_id
  LEFT JOIN checklist_items ci ON cc.id = ci.category_id
  WHERE t.user_id = p_user_id
  GROUP BY t.id, t.title, t.start_date, t.end_date, t.region_name, t.created_at
  ORDER BY t.created_at DESC;
END;
$$;


ALTER FUNCTION "public"."get_trips_with_check_progress"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$                                                    
  BEGIN
    INSERT INTO public.profiles (id, email, username)              
    VALUES (                                                     
      NEW.id,                            
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'username',                       
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',                      
        SPLIT_PART(COALESCE(NEW.email, ''), '@', 1),             
        'user_' || SUBSTRING(NEW.id::text, 1, 8)                   
      )
    );                                                             
    RETURN NEW;                                                    
  END;                                   
  $$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."checklist_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "trip_id" "uuid",
    "name" character varying(100) NOT NULL,
    "icon_key" character varying(50),
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid" NOT NULL
);


ALTER TABLE "public"."checklist_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "category_id" "uuid",
    "name" character varying(255) NOT NULL,
    "notes" "text",
    "is_required" boolean DEFAULT false,
    "is_checked" boolean DEFAULT false,
    "cabin_policy" character varying(20),
    "cabin_notes" "text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "checklist_items_cabin_policy_check" CHECK ((("cabin_policy")::"text" = ANY ((ARRAY['allowed'::character varying, 'restricted'::character varying, 'prohibited'::character varying, 'unknown'::character varying])::"text"[])))
);


ALTER TABLE "public"."checklist_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checklist_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" character varying(255) NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_public" boolean DEFAULT false
);


ALTER TABLE "public"."checklist_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email" "text",
    "username" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."profiles" IS '유저 정보';



CREATE TABLE IF NOT EXISTS "public"."shopping_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "icon_key" "text",
    "display_order" integer,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_shared" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."shopping_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shopping_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "notes" "text",
    "price" numeric,
    "quantity" integer DEFAULT 1,
    "is_checked" boolean DEFAULT false,
    "checked_by" "uuid",
    "assignee_id" "uuid",
    "display_order" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."shopping_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."template_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "icon_key" "text",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category_type" "text" DEFAULT 'packing'::"text" NOT NULL,
    CONSTRAINT "template_categories_category_type_check" CHECK (("category_type" = ANY (ARRAY['packing'::"text", 'shopping'::"text", 'todo'::"text"])))
);


ALTER TABLE "public"."template_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."template_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "notes" "text",
    "is_required" boolean DEFAULT false,
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "price" numeric,
    "quantity" integer
);


ALTER TABLE "public"."template_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."todo_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "icon_key" "text",
    "is_shared" boolean DEFAULT false NOT NULL,
    "created_by" "uuid",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."todo_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."todo_item_assignees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "todo_item_id" "uuid" NOT NULL,
    "member_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."todo_item_assignees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."todo_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "notes" "text",
    "is_checked" boolean DEFAULT false,
    "checked_by" "uuid",
    "due_date" "date",
    "display_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."todo_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "schedule_id" "uuid",
    "day_number" integer NOT NULL,
    "expense_date" "date" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "currency" "text" DEFAULT 'KRW'::"text",
    "exchange_rate" numeric(10,4),
    "amount_in_krw" numeric(12,2),
    "expense_category" "text" NOT NULL,
    "payment_method" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "is_personal" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."trip_expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_flights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "flight_id" "text" NOT NULL,
    "airline" "text" DEFAULT ''::"text" NOT NULL,
    "departure_airport" "text" DEFAULT ''::"text" NOT NULL,
    "arrival_airport" "text" DEFAULT ''::"text" NOT NULL,
    "scheduled_date" "date" NOT NULL,
    "scheduled_time" "text",
    "flight_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "trip_flights_flight_type_check" CHECK (("flight_type" = ANY (ARRAY['departure'::"text", 'return'::"text"])))
);


ALTER TABLE "public"."trip_flights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "invite_code" "text" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."trip_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "trip_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."trip_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trip_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "day_number" integer NOT NULL,
    "schedule_date" "date" NOT NULL,
    "place_id" "text" NOT NULL,
    "place_name" "text" NOT NULL,
    "place_address" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "visit_order" integer NOT NULL,
    "start_time" time without time zone,
    "duration_minutes" integer,
    "notes" "text",
    "category" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."trip_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "region_id" "text",
    "region_name" "text",
    "country_code" "text",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "companion_type" "text",
    "companion_types" "jsonb" DEFAULT '[]'::"jsonb",
    "trip_types" "jsonb" DEFAULT '[]'::"jsonb",
    "budget" numeric DEFAULT '0'::numeric,
    "image_url" "text",
    "memo" "text"
);


ALTER TABLE "public"."trips" OWNER TO "postgres";


COMMENT ON TABLE "public"."trips" IS '유저가 생성한 여행';



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checklist_templates"
    ADD CONSTRAINT "checklist_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_categories"
    ADD CONSTRAINT "shopping_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."template_categories"
    ADD CONSTRAINT "template_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."template_items"
    ADD CONSTRAINT "template_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."todo_categories"
    ADD CONSTRAINT "todo_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."todo_item_assignees"
    ADD CONSTRAINT "todo_item_assignees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."todo_item_assignees"
    ADD CONSTRAINT "todo_item_assignees_todo_item_id_member_id_key" UNIQUE ("todo_item_id", "member_id");



ALTER TABLE ONLY "public"."todo_items"
    ADD CONSTRAINT "todo_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_expenses"
    ADD CONSTRAINT "trip_expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_flights"
    ADD CONSTRAINT "trip_flights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_flights"
    ADD CONSTRAINT "trip_flights_trip_id_flight_type_key" UNIQUE ("trip_id", "flight_type");



ALTER TABLE ONLY "public"."trip_invitations"
    ADD CONSTRAINT "trip_invitations_invite_code_key" UNIQUE ("invite_code");



ALTER TABLE ONLY "public"."trip_invitations"
    ADD CONSTRAINT "trip_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_members"
    ADD CONSTRAINT "trip_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trip_members"
    ADD CONSTRAINT "trip_members_trip_id_user_id_key" UNIQUE ("trip_id", "user_id");



ALTER TABLE ONLY "public"."trip_schedules"
    ADD CONSTRAINT "trip_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "checklist_items_category_lower_name_uniq" ON "public"."checklist_items" USING "btree" ("category_id", "lower"("btrim"(("name")::"text")));



CREATE INDEX "idx_categories_display_order" ON "public"."checklist_categories" USING "btree" ("trip_id", "display_order");



CREATE INDEX "idx_checklist_categories_trip_id" ON "public"."checklist_categories" USING "btree" ("trip_id");



CREATE INDEX "idx_checklist_categories_trip_user" ON "public"."checklist_categories" USING "btree" ("trip_id", "created_by");



CREATE INDEX "idx_checklist_items_category_id" ON "public"."checklist_items" USING "btree" ("category_id");



CREATE INDEX "idx_checklist_templates_public" ON "public"."checklist_templates" USING "btree" ("is_public") WHERE ("is_public" = true);



CREATE INDEX "idx_checklist_templates_user_id" ON "public"."checklist_templates" USING "btree" ("user_id");



CREATE INDEX "idx_expenses_category" ON "public"."trip_expenses" USING "btree" ("expense_category");



CREATE INDEX "idx_expenses_day_number" ON "public"."trip_expenses" USING "btree" ("trip_id", "day_number");



CREATE INDEX "idx_expenses_schedule_id" ON "public"."trip_expenses" USING "btree" ("schedule_id");



CREATE INDEX "idx_expenses_trip_id" ON "public"."trip_expenses" USING "btree" ("trip_id");



CREATE INDEX "idx_items_checked" ON "public"."checklist_items" USING "btree" ("category_id", "is_checked");



CREATE INDEX "idx_items_display_order" ON "public"."checklist_items" USING "btree" ("category_id", "display_order");



CREATE INDEX "idx_shopping_categories_trip" ON "public"."shopping_categories" USING "btree" ("trip_id");



CREATE INDEX "idx_shopping_categories_trip_id" ON "public"."shopping_categories" USING "btree" ("trip_id");



CREATE INDEX "idx_shopping_items_category" ON "public"."shopping_items" USING "btree" ("category_id");



CREATE INDEX "idx_shopping_items_category_id" ON "public"."shopping_items" USING "btree" ("category_id");



CREATE INDEX "idx_template_categories_template_id" ON "public"."template_categories" USING "btree" ("template_id");



CREATE INDEX "idx_template_items_category_id" ON "public"."template_items" USING "btree" ("category_id");



CREATE INDEX "idx_todo_categories_trip_id" ON "public"."todo_categories" USING "btree" ("trip_id");



CREATE INDEX "idx_todo_item_assignees_item" ON "public"."todo_item_assignees" USING "btree" ("todo_item_id");



CREATE INDEX "idx_todo_item_assignees_item_id" ON "public"."todo_item_assignees" USING "btree" ("todo_item_id");



CREATE INDEX "idx_todo_item_assignees_member" ON "public"."todo_item_assignees" USING "btree" ("member_id");



CREATE INDEX "idx_todo_items_category_id" ON "public"."todo_items" USING "btree" ("category_id");



CREATE INDEX "idx_trip_expenses_schedule_id" ON "public"."trip_expenses" USING "btree" ("schedule_id");



CREATE INDEX "idx_trip_expenses_trip_date" ON "public"."trip_expenses" USING "btree" ("trip_id", "expense_date");



CREATE INDEX "idx_trip_expenses_trip_day" ON "public"."trip_expenses" USING "btree" ("trip_id", "day_number");



CREATE INDEX "idx_trip_expenses_trip_id" ON "public"."trip_expenses" USING "btree" ("trip_id");



CREATE INDEX "idx_trip_flights_trip_id" ON "public"."trip_flights" USING "btree" ("trip_id");



CREATE INDEX "idx_trip_invitations_active_code" ON "public"."trip_invitations" USING "btree" ("invite_code") WHERE ("is_active" = true);



CREATE INDEX "idx_trip_invitations_trip_active" ON "public"."trip_invitations" USING "btree" ("trip_id", "expires_at" DESC) WHERE ("is_active" = true);



CREATE UNIQUE INDEX "idx_trip_members_trip_user" ON "public"."trip_members" USING "btree" ("trip_id", "user_id");



CREATE INDEX "idx_trip_schedules_day_number" ON "public"."trip_schedules" USING "btree" ("trip_id", "day_number");



CREATE INDEX "idx_trip_schedules_trip_day_order" ON "public"."trip_schedules" USING "btree" ("trip_id", "day_number", "visit_order");



CREATE INDEX "idx_trip_schedules_trip_id" ON "public"."trip_schedules" USING "btree" ("trip_id");



CREATE INDEX "idx_trips_created_at" ON "public"."trips" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_trips_user_id" ON "public"."trips" USING "btree" ("user_id");



CREATE UNIQUE INDEX "template_items_category_lower_name_uniq" ON "public"."template_items" USING "btree" ("category_id", "lower"("btrim"("name")));



CREATE OR REPLACE TRIGGER "update_checklist_templates_updated_at" BEFORE UPDATE ON "public"."checklist_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."checklist_categories"
    ADD CONSTRAINT "checklist_categories_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."checklist_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checklist_templates"
    ADD CONSTRAINT "checklist_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_categories"
    ADD CONSTRAINT "shopping_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."shopping_categories"
    ADD CONSTRAINT "shopping_categories_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."trip_members"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."shopping_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_items"
    ADD CONSTRAINT "shopping_items_checked_by_fkey" FOREIGN KEY ("checked_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."template_categories"
    ADD CONSTRAINT "template_categories_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."checklist_templates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."template_items"
    ADD CONSTRAINT "template_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."template_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."todo_categories"
    ADD CONSTRAINT "todo_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."todo_categories"
    ADD CONSTRAINT "todo_categories_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."todo_item_assignees"
    ADD CONSTRAINT "todo_item_assignees_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."trip_members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."todo_item_assignees"
    ADD CONSTRAINT "todo_item_assignees_todo_item_id_fkey" FOREIGN KEY ("todo_item_id") REFERENCES "public"."todo_items"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."todo_items"
    ADD CONSTRAINT "todo_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."todo_categories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."todo_items"
    ADD CONSTRAINT "todo_items_checked_by_fkey" FOREIGN KEY ("checked_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."todo_items"
    ADD CONSTRAINT "todo_items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."trip_expenses"
    ADD CONSTRAINT "trip_expenses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."trip_expenses"
    ADD CONSTRAINT "trip_expenses_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "public"."trip_schedules"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."trip_expenses"
    ADD CONSTRAINT "trip_expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_flights"
    ADD CONSTRAINT "trip_flights_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_invitations"
    ADD CONSTRAINT "trip_invitations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."trip_invitations"
    ADD CONSTRAINT "trip_invitations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_members"
    ADD CONSTRAINT "trip_members_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_members"
    ADD CONSTRAINT "trip_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trip_schedules"
    ADD CONSTRAINT "trip_schedules_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trips"
    ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Trip members can delete todo assignees" ON "public"."todo_item_assignees" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM (("public"."todo_items"
     JOIN "public"."todo_categories" ON (("todo_categories"."id" = "todo_items"."category_id")))
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_items"."id" = "todo_item_assignees"."todo_item_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can delete todo categories" ON "public"."todo_categories" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "todo_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can delete todo items" ON "public"."todo_items" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."todo_categories"
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_categories"."id" = "todo_items"."category_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can insert todo assignees" ON "public"."todo_item_assignees" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."todo_items"
     JOIN "public"."todo_categories" ON (("todo_categories"."id" = "todo_items"."category_id")))
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_items"."id" = "todo_item_assignees"."todo_item_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can insert todo categories" ON "public"."todo_categories" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "todo_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can insert todo items" ON "public"."todo_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."todo_categories"
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_categories"."id" = "todo_items"."category_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can update todo categories" ON "public"."todo_categories" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "todo_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can update todo items" ON "public"."todo_items" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."todo_categories"
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_categories"."id" = "todo_items"."category_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can view todo assignees" ON "public"."todo_item_assignees" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."todo_items"
     JOIN "public"."todo_categories" ON (("todo_categories"."id" = "todo_items"."category_id")))
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_items"."id" = "todo_item_assignees"."todo_item_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can view todo categories" ON "public"."todo_categories" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "todo_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Trip members can view todo items" ON "public"."todo_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."todo_categories"
     JOIN "public"."trip_members" ON (("trip_members"."trip_id" = "todo_categories"."trip_id")))
  WHERE (("todo_categories"."id" = "todo_items"."category_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."checklist_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checklist_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checklist_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."template_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."template_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."todo_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."todo_item_assignees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."todo_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_flights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trip_schedules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trips" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "같은 여행 멤버의 프로필 조회 가능" ON "public"."profiles" FOR SELECT USING ((("id" = "auth"."uid"()) OR ("id" IN ( SELECT "tm"."user_id"
   FROM "public"."trip_members" "tm"
  WHERE ("tm"."trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids"))))));



CREATE POLICY "멤버는 멤버여행 및 본인의  쇼핑 카테고리만 " ON "public"."shopping_categories" FOR SELECT USING ((("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")) AND (("is_shared" = true) OR ("created_by" = "auth"."uid"()))));



CREATE POLICY "멤버는 본인의 여행의 멤버  목록 조회 가능" ON "public"."trip_members" FOR SELECT USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행에 경비
  추가 가능" ON "public"."trip_expenses" FOR INSERT WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행에 쇼핑  카테고리 추" ON "public"."shopping_categories" FOR INSERT WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행에 일정
  추가 가능" ON "public"."trip_schedules" FOR INSERT WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 경비
  삭제 가능" ON "public"."trip_expenses" FOR DELETE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 경비
  수정 가능" ON "public"."trip_expenses" FOR UPDATE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 경비
  조회 가능" ON "public"."trip_expenses" FOR SELECT USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 일정
  삭제 가능" ON "public"."trip_schedules" FOR DELETE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 일정
  수정 가능" ON "public"."trip_schedules" FOR UPDATE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 일정
  조회 가능" ON "public"."trip_schedules" FOR SELECT USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "멤버는 자신이 속한 여행의 초대
  조회 가능" ON "public"."trip_invitations" FOR SELECT USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "본인 체크리스트 아이템 삭제" ON "public"."checklist_items" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."checklist_categories" "cc"
  WHERE (("cc"."id" = "checklist_items"."category_id") AND ("cc"."created_by" = "auth"."uid"())))));



CREATE POLICY "본인 체크리스트 아이템 생성" ON "public"."checklist_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."checklist_categories" "cc"
  WHERE (("cc"."id" = "checklist_items"."category_id") AND ("cc"."created_by" = "auth"."uid"())))));



CREATE POLICY "본인 체크리스트 아이템 수정" ON "public"."checklist_items" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."checklist_categories" "cc"
  WHERE (("cc"."id" = "checklist_items"."category_id") AND ("cc"."created_by" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."checklist_categories" "cc"
  WHERE (("cc"."id" = "checklist_items"."category_id") AND ("cc"."created_by" = "auth"."uid"())))));



CREATE POLICY "본인 체크리스트 아이템 조회" ON "public"."checklist_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."checklist_categories" "cc"
  WHERE (("cc"."id" = "checklist_items"."category_id") AND ("cc"."created_by" = "auth"."uid"())))));



CREATE POLICY "본인 체크리스트 카테고리 삭제" ON "public"."checklist_categories" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "본인 체크리스트 카테고리 생성" ON "public"."checklist_categories" FOR INSERT WITH CHECK ((("created_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "checklist_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"()))))));



CREATE POLICY "본인 체크리스트 카테고리 수정" ON "public"."checklist_categories" FOR UPDATE USING (("created_by" = "auth"."uid"())) WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "본인 체크리스트 카테고리 조회" ON "public"."checklist_categories" FOR SELECT USING ((("created_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "checklist_categories"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"()))))));



CREATE POLICY "본인 프로필만 수정 가능" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "본인이 만든 쇼핑 카테고리만
  삭제 가능" ON "public"."shopping_categories" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "본인이 만든 쇼핑 카테고리만
  수정 가능" ON "public"."shopping_categories" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "여행 멤버는 해당 여행의 항공편 삭제 가능" ON "public"."trip_flights" FOR DELETE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "여행 멤버는 해당 여행의 항공편 생성 가능" ON "public"."trip_flights" FOR INSERT WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "여행 멤버는 해당 여행의 항공편 수정 가능" ON "public"."trip_flights" FOR UPDATE USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "여행 멤버는 해당 여행의 항공편 조회 가능" ON "public"."trip_flights" FOR SELECT USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "여행 소유자 또는 본인만 멤버
  삭제 가능" ON "public"."trip_members" FOR DELETE USING ((("trip_id" IN ( SELECT "public"."get_my_owned_trip_ids"() AS "get_my_owned_trip_ids")) OR ("user_id" = "auth"."uid"())));



CREATE POLICY "여행 소유자만 초대 생성 가능" ON "public"."trip_invitations" FOR INSERT WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_owned_trip_ids"() AS "get_my_owned_trip_ids")));



CREATE POLICY "유저는 본인 및 멤버 여행 조회
  가능" ON "public"."trips" FOR SELECT USING (("id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));



CREATE POLICY "유저는 본인 여행만 관리 가능" ON "public"."trips" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "유저는 본인 여행만 삭제 가능" ON "public"."trips" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "유저는 본인 여행만 수정 가능" ON "public"."trips" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "유저는 본인 여행의 일행을 확인 가능" ON "public"."trip_invitations" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "trip_invitations"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "유저는 본인의 여행 초대 생성 가능" ON "public"."trip_invitations" FOR INSERT TO "authenticated" WITH CHECK ((("created_by" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."trip_members"
  WHERE (("trip_members"."trip_id" = "trip_invitations"."trip_id") AND ("trip_members"."user_id" = "auth"."uid"()))))));



CREATE POLICY "유저는 본인의 체크리스트 템플릿만 수정 가능" ON "public"."template_categories" USING (("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE ("checklist_templates"."user_id" = "auth"."uid"())))) WITH CHECK (("template_id" IN ( SELECT "checklist_templates"."id"
   FROM "public"."checklist_templates"
  WHERE ("checklist_templates"."user_id" = "auth"."uid"()))));



CREATE POLICY "유저는 본인의 체크리스트 템플릿의 아이템만 " ON "public"."template_items" USING (("category_id" IN ( SELECT "tc"."id"
   FROM ("public"."template_categories" "tc"
     JOIN "public"."checklist_templates" "ct" ON (("ct"."id" = "tc"."template_id")))
  WHERE ("ct"."user_id" = "auth"."uid"())))) WITH CHECK (("category_id" IN ( SELECT "tc"."id"
   FROM ("public"."template_categories" "tc"
     JOIN "public"."checklist_templates" "ct" ON (("ct"."id" = "tc"."template_id")))
  WHERE ("ct"."user_id" = "auth"."uid"()))));



CREATE POLICY "유저는 본인이 만든 초대만 수정 가능" ON "public"."trip_invitations" FOR UPDATE TO "authenticated" USING (("created_by" = "auth"."uid"())) WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "유저는 자신을 멤버로 추가 가능" ON "public"."trip_members" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "유저는 자신의 템플릿과 공개된 템플릿만 조회 " ON "public"."checklist_templates" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("is_public" = true)));



CREATE POLICY "유저는 자신의 템플릿만 삭제 가능" ON "public"."checklist_templates" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "유저는 자신의 템플릿만 생성 가능" ON "public"."checklist_templates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "유저는 자신의 템플릿만 수정 가능" ON "public"."checklist_templates" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "유저는 접근 가능 쇼핑 카테고리 물품 삭제 가" ON "public"."shopping_items" FOR DELETE USING (("category_id" IN ( SELECT "shopping_categories"."id"
   FROM "public"."shopping_categories"
  WHERE (("shopping_categories"."trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")) AND (("shopping_categories"."is_shared" = true) OR ("shopping_categories"."created_by" = "auth"."uid"()))))));



CREATE POLICY "유저는 접근 가능 쇼핑 카테고리 물품 생성 가" ON "public"."shopping_items" FOR INSERT WITH CHECK (("category_id" IN ( SELECT "shopping_categories"."id"
   FROM "public"."shopping_categories"
  WHERE (("shopping_categories"."trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")) AND (("shopping_categories"."is_shared" = true) OR ("shopping_categories"."created_by" = "auth"."uid"()))))));



CREATE POLICY "유저는 접근 가능 쇼핑 카테고리 물품 수정 가" ON "public"."shopping_items" FOR UPDATE USING (("category_id" IN ( SELECT "shopping_categories"."id"
   FROM "public"."shopping_categories"
  WHERE (("shopping_categories"."trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")) AND (("shopping_categories"."is_shared" = true) OR ("shopping_categories"."created_by" = "auth"."uid"()))))));



CREATE POLICY "유저는 접근 가능 쇼핑 카테고리 물품 조회 가" ON "public"."shopping_items" FOR SELECT USING (("category_id" IN ( SELECT "shopping_categories"."id"
   FROM "public"."shopping_categories"
  WHERE (("shopping_categories"."trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")) AND (("shopping_categories"."is_shared" = true) OR ("shopping_categories"."created_by" = "auth"."uid"()))))));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."accept_invitation"("p_code" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."accept_invitation"("p_code" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."accept_invitation"("p_code" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_trip_with_checklist"("p_trip_data" "jsonb", "p_categories" "jsonb", "p_items" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_trip_with_checklist"("p_trip_data" "jsonb", "p_categories" "jsonb", "p_items" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_trip_with_checklist"("p_trip_data" "jsonb", "p_categories" "jsonb", "p_items" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_owned_trip_ids"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_owned_trip_ids"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_owned_trip_ids"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_trip_ids"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_trip_ids"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_trip_ids"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_trips_with_check_progress"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_trips_with_check_progress"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_trips_with_check_progress"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."checklist_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_categories" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_items" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_items" TO "service_role";



GRANT ALL ON TABLE "public"."checklist_templates" TO "anon";
GRANT ALL ON TABLE "public"."checklist_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."checklist_templates" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_categories" TO "anon";
GRANT ALL ON TABLE "public"."shopping_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_categories" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_items" TO "anon";
GRANT ALL ON TABLE "public"."shopping_items" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_items" TO "service_role";



GRANT ALL ON TABLE "public"."template_categories" TO "anon";
GRANT ALL ON TABLE "public"."template_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."template_categories" TO "service_role";



GRANT ALL ON TABLE "public"."template_items" TO "anon";
GRANT ALL ON TABLE "public"."template_items" TO "authenticated";
GRANT ALL ON TABLE "public"."template_items" TO "service_role";



GRANT ALL ON TABLE "public"."todo_categories" TO "anon";
GRANT ALL ON TABLE "public"."todo_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."todo_categories" TO "service_role";



GRANT ALL ON TABLE "public"."todo_item_assignees" TO "anon";
GRANT ALL ON TABLE "public"."todo_item_assignees" TO "authenticated";
GRANT ALL ON TABLE "public"."todo_item_assignees" TO "service_role";



GRANT ALL ON TABLE "public"."todo_items" TO "anon";
GRANT ALL ON TABLE "public"."todo_items" TO "authenticated";
GRANT ALL ON TABLE "public"."todo_items" TO "service_role";



GRANT ALL ON TABLE "public"."trip_expenses" TO "anon";
GRANT ALL ON TABLE "public"."trip_expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_expenses" TO "service_role";



GRANT ALL ON TABLE "public"."trip_flights" TO "anon";
GRANT ALL ON TABLE "public"."trip_flights" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_flights" TO "service_role";



GRANT ALL ON TABLE "public"."trip_invitations" TO "anon";
GRANT ALL ON TABLE "public"."trip_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."trip_members" TO "anon";
GRANT ALL ON TABLE "public"."trip_members" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_members" TO "service_role";



GRANT ALL ON TABLE "public"."trip_schedules" TO "anon";
GRANT ALL ON TABLE "public"."trip_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."trips" TO "authenticated";
GRANT ALL ON TABLE "public"."trips" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























