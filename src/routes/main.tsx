import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../features/main/mainPage";
import MainPageSkeleton from "../features/main/components/MainPageSkeleton";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
  beforeLoad: requireAuth,
  pendingComponent: MainPageSkeleton,
});

function RouteComponent() {
  return <MainPage />;
}
