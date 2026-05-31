import { createFileRoute } from "@tanstack/react-router";
import ExpensePage from "@/features/expense/ExpensePage";
import ExpenseSkeleton from "@/features/expense/components/ExpenseSkeleton";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/expense/$tripId")({
  component: ExpensePage,
  beforeLoad: requireAuth,
  pendingComponent: ExpenseSkeleton,
});
