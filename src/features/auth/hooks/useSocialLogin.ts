import { useState, useEffect } from "react";
import type { Provider } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/shared/service/supabase/cilent";
import {
  hasNativeCapability,
  isReactNativeWebView,
  requestAppleSignIn,
  requestKakaoSignIn,
} from "@/shared/utils/nativeMessage";

const PROVIDER_LABEL: Partial<Record<Provider, string>> = {
  kakao: "카카오",
  apple: "Apple",
};

export const useSocialLogin = (returnTo?: string) => {
  const [socialError, setSocialError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const navigateIfSignedIn = () => {
      const safeReturnTo = sanitizeReturnTo(returnTo);
      navigate({ to: safeReturnTo ?? "/main" });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session) navigateIfSignedIn();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) return;
      navigateIfSignedIn();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, returnTo]);

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

  const handleAppleLoginNative = async () => {
    try {
      setSocialError(null);
      const result = await requestAppleSignIn();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: result.identityToken,
      });
      if (error) throw error;
    } catch {
      setSocialError(`${PROVIDER_LABEL.apple} 로그인 중 오류가 발생했습니다.`);
    }
  };

  const handleAppleLogin = () =>
    isReactNativeWebView()
      ? handleAppleLoginNative()
      : handleSocialLogin("apple");

  const handleKakaoLoginNative = async () => {
    try {
      setSocialError(null);
      const result = await requestKakaoSignIn();
      if (!result.ok) {
        // 사용자가 카카오톡/카카오계정 화면에서 직접 취소한 건 에러가 아니다.
        if (result.cancelled) return;
        throw new Error(result.message ?? "Kakao Sign In failed");
      }
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: result.idToken,
      });
      if (error) throw error;
    } catch {
      setSocialError(`${PROVIDER_LABEL.kakao} 로그인 중 오류가 발생했습니다.`);
    }
  };

  // 네이티브 카카오 로그인을 지원하는 앱 바이너리에서만 브릿지를 쓴다.
  // 구버전 앱·웹 브라우저는 기존 웹 OAuth로 폴백.
  const handleKakaoLogin = () =>
    hasNativeCapability("kakaoLogin")
      ? handleKakaoLoginNative()
      : handleSocialLogin("kakao");

  return {
    handleKakaoLogin,
    handleAppleLogin,
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
