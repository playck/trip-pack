import { createFileRoute } from "@tanstack/react-router";
import PastTripsPage from "@/features/mypage/PastTripsPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/mypage/past-trips")({
  component: PastTripsPage,
  beforeLoad: requireAuth,
});
