import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "@/shared/service/supabase/cilent";

export const useSocialLogin = (returnTo?: string) => {
  const [socialError, setSocialError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setSocialError(null);
      const safeReturnTo = sanitizeReturnTo(returnTo);
      const redirectTo = safeReturnTo
        ? `${window.location.origin}${safeReturnTo}`
        : `${window.location.origin}/main`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            prompt: provider === "google" ? "select_account" : "login",
          },
        },
      });

      if (error) throw error;
    } catch {
      setSocialError(
        `${provider === "kakao" ? "카카오" : "구글"} 로그인 중 오류가 발생했습니다.`,
      );
    }
  };

  return {
    handleKakaoLogin: () => handleSocialLogin("kakao"),
    handleGoogleLogin: () => handleSocialLogin("google"),
    socialError,
  };
};

const sanitizeReturnTo = (returnTo?: string): string | undefined => {
  if (!returnTo) return undefined;
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) return undefined;
  try {
    const url = new URL(returnTo, window.location.origin);
    if (url.origin !== window.location.origin) return undefined;
  } catch {
    return undefined;
  }
  return returnTo;
};
