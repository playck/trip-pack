import { createFileRoute } from "@tanstack/react-router";
import PastTripsPage from "@/features/mypage/PastTripsPage";

export const Route = createFileRoute("/mypage/past-trips")({
  component: PastTripsPage,
});
