import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "@/shared/service/supabase/cilent";

const PROVIDER_LABEL: Partial<Record<Provider, string>> = {
  kakao: "카카오",
  apple: "Apple",
};

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
        options: { redirectTo },
      });

      if (error) throw error;
    } catch {
      const label = PROVIDER_LABEL[provider] ?? "소셜";
      setSocialError(`${label} 로그인 중 오류가 발생했습니다.`);
    }
  };

  return {
    handleKakaoLogin: () => handleSocialLogin("kakao"),
    handleAppleLogin: () => handleSocialLogin("apple"),
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
