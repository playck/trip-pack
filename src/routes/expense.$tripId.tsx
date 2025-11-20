import { createFileRoute } from "@tanstack/react-router";
import ExpensePage from "@/features/expense/ExpensePage";

export const Route = createFileRoute("/expense/$tripId")({
  component: ExpensePage,
});
