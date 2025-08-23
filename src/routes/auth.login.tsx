import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: lazyRouteComponent(
    () => import("@/features/auth/login/LoginPage")
  ),
});
