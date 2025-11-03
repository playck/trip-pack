import { createFileRoute } from "@tanstack/react-router";
import EditDaySchedulePage from "@/features/schedule/EditDaySchedulePage";

export const Route = createFileRoute("/schedule/edit/$tripId/$dayNumber")({
  component: EditDaySchedulePage,
});
