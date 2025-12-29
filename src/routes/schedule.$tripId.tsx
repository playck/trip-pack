import { createFileRoute } from "@tanstack/react-router";
import SchedulePage from "@/features/schedule/SchedulePage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/schedule/$tripId")({
  component: SchedulePage,
  beforeLoad: requireAuth,
});
