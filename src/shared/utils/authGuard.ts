import { redirect } from "@tanstack/react-router";
import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import {
  supabase,
  AUTH_STORAGE_KEY,
} from "@/shared/service/supabase/cilent";

// 느린 네트워크·로그인형 와이파이에서 토큰 갱신 재시도(최대 ~30초)를 화면 이동마다 기다리지 않게 하는 상한
const SESSION_CHECK_TIMEOUT_MS = 3000;

const hasStoredSession = () => !!localStorage.getItem(AUTH_STORAGE_KEY);

// 가드는 화면 진입 여부만 정한다 — 데이터 접근은 RLS가 막는다.
// 그래서 네트워크 때문에 토큰 갱신만 못 한 경우엔 기기에 남은 세션을 믿고 통과시킨다
// (여행지에서 오프라인으로 앱을 열 때 로그인 화면에 갇히지 않게).
export const requireAuth = async () => {
  if (!navigator.onLine) {
    if (hasStoredSession()) return;
    throw redirect({ to: "/auth/login" });
  }

  const result = await Promise.race([
    supabase.auth.getSession(),
    new Promise<"timeout">((resolve) =>
      setTimeout(() => resolve("timeout"), SESSION_CHECK_TIMEOUT_MS),
    ),
  ]);

  if (result === "timeout") {
    if (hasStoredSession()) return;
    throw redirect({ to: "/auth/login" });
  }

  const {
    data: { session },
    error,
  } = result;

  if (session) return;
  if (isAuthRetryableFetchError(error) && hasStoredSession()) return;

  throw redirect({
    to: "/auth/login",
  });
};
