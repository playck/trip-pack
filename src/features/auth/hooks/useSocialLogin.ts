import { useState } from "react";
import type { Provider } from "@supabase/supabase-js";
import { supabase } from "@/shared/service/supabase/cilent";

export const useSocialLogin = () => {
  const [socialError, setSocialError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    try {
      setSocialError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/main`,
          queryParams: {
            prompt: provider === "google" ? "select_account" : "login",
          },
        },
      });

      if (error) throw error;
    } catch {
      setSocialError(
        `${provider === "kakao" ? "카카오" : "구글"} 로그인 중 오류가 발생했습니다.`
      );
    }
  };

  return {
    handleKakaoLogin: () => handleSocialLogin("kakao"),
    handleGoogleLogin: () => handleSocialLogin("google"),
    socialError,
  };
};
