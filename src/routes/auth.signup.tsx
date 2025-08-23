import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/signup")({
  component: lazyRouteComponent(
    () => import("@/features/auth/signup/SignupPage")
  ),
});
