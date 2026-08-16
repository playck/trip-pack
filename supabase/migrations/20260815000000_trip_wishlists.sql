-- 가고 싶은 곳 보관함 (여행별 위시리스트)
-- 일차 미정 상태로 장소를 담아두고, 일정 확정 시 trip_schedules로 전환한다.

CREATE TABLE IF NOT EXISTS "public"."trip_wishlists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trip_id" "uuid" NOT NULL,
    "place_id" "text" NOT NULL,
    "place_name" "text" NOT NULL,
    "place_address" "text",
    "latitude" numeric(10,8),
    "longitude" numeric(11,8),
    "notes" "text",
    "category" "text",
    "sort_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."trip_wishlists" OWNER TO "postgres";

ALTER TABLE ONLY "public"."trip_wishlists"
    ADD CONSTRAINT "trip_wishlists_pkey" PRIMARY KEY ("id");

-- 같은 여행에 같은 장소는 한 번만 (멀티 기기 캐시 불일치·연타로 인한 중복 방지)
ALTER TABLE ONLY "public"."trip_wishlists"
    ADD CONSTRAINT "trip_wishlists_trip_place_uniq" UNIQUE ("trip_id", "place_id");

ALTER TABLE ONLY "public"."trip_wishlists"
    ADD CONSTRAINT "trip_wishlists_trip_id_fkey"
    FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE CASCADE;

CREATE INDEX "idx_trip_wishlists_trip_sort"
    ON "public"."trip_wishlists" USING "btree" ("trip_id", "sort_order");

ALTER TABLE "public"."trip_wishlists" ENABLE ROW LEVEL SECURITY;

-- 정책명은 Postgres 식별자 63바이트 제한에 맞춰 짧게 유지한다
CREATE POLICY "멤버는 자신이 속한 여행의 위시 추가 가능"
    ON "public"."trip_wishlists" FOR INSERT
    WITH CHECK (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));

CREATE POLICY "멤버는 자신이 속한 여행의 위시 조회 가능"
    ON "public"."trip_wishlists" FOR SELECT
    USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));

CREATE POLICY "멤버는 자신이 속한 여행의 위시 수정 가능"
    ON "public"."trip_wishlists" FOR UPDATE
    USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));

CREATE POLICY "멤버는 자신이 속한 여행의 위시 삭제 가능"
    ON "public"."trip_wishlists" FOR DELETE
    USING (("trip_id" IN ( SELECT "public"."get_my_trip_ids"() AS "get_my_trip_ids")));

GRANT ALL ON TABLE "public"."trip_wishlists" TO "anon";
GRANT ALL ON TABLE "public"."trip_wishlists" TO "authenticated";
GRANT ALL ON TABLE "public"."trip_wishlists" TO "service_role";
