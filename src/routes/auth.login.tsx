import {
  createFileRoute,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";
import { supabase } from "@/shared/service/supabase/cilent";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({
    returnTo: (search.returnTo as string) || undefined,
  }),
  beforeLoad: async ({ search }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const returnTo = search.returnTo;
    const safeReturnTo =
      returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/main";
    throw redirect({ to: safeReturnTo });
  },
  component: lazyRouteComponent(
    () => import("@/features/auth/login/LoginPage")
  ),
});
