import { redirect } from "@tanstack/react-router";
import { supabase } from "@/shared/service/supabase/cilent";

export const requireAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw redirect({
      to: "/auth/login",
    });
  }
};
