import { createFileRoute } from "@tanstack/react-router";
import ManageDaySchedulePage from "@/features/schedule/ManageDaySchedulePage";

export const Route = createFileRoute("/schedule/edit/$tripId/$dayNumber")({
  component: ManageDaySchedulePage,
});
