import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../features/main/mainPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <MainPage />;
}
