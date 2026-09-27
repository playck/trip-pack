import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.type";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase 환경변수가 설정되지 않았습니다. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인해주세요."
  );
}

// 세션 저장 키 — supabase-js 기본값과 같은 규칙이라 기존 로그인은 그대로 유지된다.
// 오프라인 라우트 가드(authGuard)가 네트워크 없이 세션 유무를 확인할 때 쓰므로 명시적으로 고정한다.
export const AUTH_STORAGE_KEY = `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { storageKey: AUTH_STORAGE_KEY },
});
