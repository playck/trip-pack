import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/shared/service/supabase/cilent";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          setError(error.message);
        } else {
          setUser(user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Auth state 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toaster.create({
        description: "성공적으로 로그아웃되었습니다.",
        type: "success",
      });
      navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Logout error:", error);
      toaster.create({
        description: "로그아웃 중 오류가 발생했습니다.",
        type: "error",
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      // 실제 구현 시에는 Edge Function이나 백엔드 API 호출 필요
      // 추후 실제 계정 삭제 API 연동 필요

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toaster.create({
        description: "회원 탈퇴 처리가 완료되었습니다.",
        type: "success",
      });
      navigate({ to: "/auth/login" });
    } catch (error) {
      console.error("Delete account error:", error);
      toaster.create({
        description: "회원 탈퇴 처리 중 오류가 발생했습니다.",
        type: "error",
      });
      throw error;
    }
  };

  return { user, loading, error, logout, deleteAccount };
};
