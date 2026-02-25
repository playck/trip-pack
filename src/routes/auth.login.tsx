import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>): { returnTo?: string } => ({
    returnTo: (search.returnTo as string) || undefined,
  }),
  component: lazyRouteComponent(
    () => import("@/features/auth/login/LoginPage")
  ),
});
