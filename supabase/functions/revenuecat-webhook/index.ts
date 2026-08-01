// =====================================================================
// RevenueCat Webhook — 앱 IAP 일회성 언락 → profiles.tier 갱신
//
//   흐름: RevenueCat 이벤트 → Authorization 헤더 검증 → (환경 게이트)
//         → payment_events 멱등 기록 → profiles.tier premium/free 반영
//
//   결제 모델: 비소모성(일회성) 언락 → 영구 premium (tier='premium').
//   환불/취소 → tier='free'. (만료 개념 없음 — expires_at 컬럼 폐기됨)
//
//   보안 하드닝(코드리뷰 대응):
//     - 환경 게이트: SANDBOX/TestFlight 이벤트는 REVENUECAT_ALLOW_SANDBOX=true 일 때만 반영.
//     - 멱등: payment_events는 processed_at=NULL로 먼저 기록, tier 반영 성공 후 processed_at 스탬프.
//       재시도(23505)는 processed_at 재확인 → 미처리면 tier 재적용(부여 유실 방지).
//     - entitlement 엄격: 'premium' 엔타이틀먼트 또는 우리 product id일 때만 tier 변경(fail-open 제거).
//     - 0-row 방어: 부여가 0행이면(프로필 없음) processed 마킹하지 않고 500 → 재시도.
//     - TRANSFER: 계정 간 이전 시 transferred_to 부여 / transferred_from 회수.
//
//   시크릿(전부 env, RevenueCat 계정 생성 후 주입):
//     REVENUECAT_WEBHOOK_AUTH       RevenueCat 대시보드 Authorization 값과 동일
//     REVENUECAT_ENTITLEMENT_ID     엔타이틀먼트 식별자 (기본 "premium")
//     REVENUECAT_PREMIUM_PRODUCT_ID 상품 식별자 (기본 "com.trippack.app.premium")
//     REVENUECAT_ALLOW_SANDBOX      "true"면 샌드박스 이벤트도 반영(테스트용, 출시 시 미설정)
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 는 런타임이 자동 주입.
//
//   config.toml 에 verify_jwt = false 필요 (웹훅은 JWT 없이 우리 헤더로 인증).
// =====================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

const WEBHOOK_AUTH = Deno.env.get("REVENUECAT_WEBHOOK_AUTH") ?? "";
const ENTITLEMENT_ID = Deno.env.get("REVENUECAT_ENTITLEMENT_ID") ?? "premium";
const PREMIUM_PRODUCT_ID =
  Deno.env.get("REVENUECAT_PREMIUM_PRODUCT_ID") ?? "com.trippack.app.premium";
const ALLOW_SANDBOX = Deno.env.get("REVENUECAT_ALLOW_SANDBOX") === "true";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// 비소모성 일회성 언락에 적용되는 이벤트만.
// (RENEWAL/UNCANCELLATION/PRODUCT_CHANGE/SUBSCRIPTION_PAUSED는 구독 전용 → 미사용.
//  구독 상품 추가 시 revoke는 CANCELLATION=자동갱신 해지 의미라 EXPIRATION과 구분 필요.)
const GRANT_TYPES = new Set(["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE"]);
const REVOKE_TYPES = new Set(["CANCELLATION", "EXPIRATION"]);

const STORE_TO_PROVIDER: Record<string, string> = {
  APP_STORE: "apple",
  MAC_APP_STORE: "apple",
  PLAY_STORE: "google",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type Supa = ReturnType<typeof createClient>;

// premium 부여. 프로필 0행이면 false 반환(호출부가 500으로 재시도 유도).
async function grantPremium(supabase: Supa, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ tier: "premium" })
    .eq("id", userId)
    .select("id");
  if (error) throw error;
  return !!data && data.length > 0;
}

async function revokePremium(supabase: Supa, userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ tier: "free" })
    .eq("id", userId);
  if (error) throw error;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // 1) 인증 — RevenueCat 대시보드에 설정한 Authorization 헤더 검증
  const auth = req.headers.get("Authorization") ?? "";
  if (!WEBHOOK_AUTH || !timingSafeEqual(auth, WEBHOOK_AUTH)) {
    return json({ error: "Unauthorized" }, 401);
  }

  let payload: { event?: Record<string, unknown> };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const event = payload.event;
  if (!event || typeof event !== "object") {
    return json({ error: "Missing event" }, 400);
  }

  const eventId = String(event.id ?? "");
  const eventType = String(event.type ?? "");
  const appUserId = String(event.app_user_id ?? "");
  const store = String(event.store ?? "");
  const environment = String(event.environment ?? "");
  const productId = event.product_id != null ? String(event.product_id) : null;
  const entitlementIds = Array.isArray(event.entitlement_ids)
    ? (event.entitlement_ids as string[])
    : [];
  // 실제 구매통화 금액 우선(price는 USD 환산 float). 통화도 함께 보존.
  const priceRaw =
    typeof event.price_in_purchased_currency === "number"
      ? event.price_in_purchased_currency
      : typeof event.price === "number"
        ? event.price
        : null;
  const currency = event.currency != null ? String(event.currency) : null;

  // 2) 환경 게이트 — 샌드박스/TestFlight는 명시 허용 시에만 반영(운영 DB 오염 방지)
  if (environment !== "PRODUCTION" && !ALLOW_SANDBOX) {
    return json({ ok: true, skipped: "non_production" });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // 3) TRANSFER — 계정 간 엔타이틀먼트 이전(교차 계정 복원). app_user_id 없이 배열로 옴.
  if (eventType === "TRANSFER") {
    const toIds = Array.isArray(event.transferred_to)
      ? (event.transferred_to as string[])
      : [];
    const fromIds = Array.isArray(event.transferred_from)
      ? (event.transferred_from as string[])
      : [];
    try {
      for (const uid of toIds) {
        if (UUID_RE.test(uid)) await grantPremium(supabase, uid);
      }
      for (const uid of fromIds) {
        if (UUID_RE.test(uid)) await revokePremium(supabase, uid);
      }
    } catch (e) {
      return json(
        { error: "transfer_failed", detail: (e as Error).message },
        500,
      );
    }
    return json({ ok: true, transfer: { to: toIds.length, from: fromIds.length } });
  }

  // 4) 우리 유저(=Supabase uid) 매핑 불가하면 스킵(무한 재시도 방지)
  if (!UUID_RE.test(appUserId)) {
    return json({ ok: true, skipped: "unmapped_app_user_id" });
  }
  const provider = STORE_TO_PROVIDER[store] ?? null;
  if (!eventId || !provider) {
    return json({ ok: true, skipped: "missing_event_id_or_store" });
  }

  // 5) 멱등 기록 — processed_at=NULL로 먼저 기록. tier 반영 성공 후에 스탬프.
  const { error: insertErr } = await supabase.from("payment_events").insert({
    user_id: appUserId,
    provider,
    provider_event_id: eventId,
    event_type: eventType,
    amount: priceRaw,
    currency,
    raw_payload: event,
    processed_at: null,
  });

  if (insertErr) {
    if (insertErr.code === "23505") {
      // 중복 — 이전 전송이 tier까지 완료했는지 확인
      const { data: existing } = await supabase
        .from("payment_events")
        .select("processed_at")
        .eq("provider", provider)
        .eq("provider_event_id", eventId)
        .maybeSingle();
      if (existing?.processed_at) {
        return json({ ok: true, duplicate: true });
      }
      // 이전 insert는 됐지만 tier 반영 실패 → 아래에서 재적용(마킹은 성공 후)
    } else if (insertErr.code === "23503") {
      return json({ ok: true, skipped: "unknown_user" });
    } else {
      return json({ error: "db_insert_failed", detail: insertErr.message }, 500);
    }
  }

  // 6) tier 반영 — 우리 엔타이틀먼트 또는 우리 상품일 때만(fail-open 제거)
  const touchesOurPremium =
    entitlementIds.includes(ENTITLEMENT_ID) || productId === PREMIUM_PRODUCT_ID;

  if (touchesOurPremium) {
    try {
      if (GRANT_TYPES.has(eventType)) {
        const granted = await grantPremium(supabase, appUserId);
        if (!granted) {
          // 프로필 행 없음 → processed 마킹하지 않고 500(재시도 유도)
          return json({ error: "profile_not_found" }, 500);
        }
      } else if (REVOKE_TYPES.has(eventType)) {
        await revokePremium(supabase, appUserId);
      }
    } catch (e) {
      return json(
        { error: "tier_update_failed", detail: (e as Error).message },
        500,
      );
    }
  }

  // 7) 처리 완료 스탬프 (tier 반영 성공 후에만)
  await supabase
    .from("payment_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("provider", provider)
    .eq("provider_event_id", eventId);

  return json({
    ok: true,
    event_type: eventType,
    product_id: productId,
    applied: touchesOurPremium,
  });
});
