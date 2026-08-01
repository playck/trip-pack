import { createFileRoute } from "@tanstack/react-router";
import SubscribePage from "@/features/subscription/pages/SubscribePage";

export const Route = createFileRoute("/subscribe")({
  component: SubscribePage,
});
