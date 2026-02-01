import { createFileRoute } from "@tanstack/react-router";
import EditDaySchedulePage from "@/features/schedule/EditDaySchedulePage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/schedule/edit/$tripId/$dayNumber")({
  component: EditDaySchedulePage,
  beforeLoad: requireAuth,
});
