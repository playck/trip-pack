import { createFileRoute } from "@tanstack/react-router";
import SettlementPage from "@/features/expense/SettlementPage";
import SettlementSkeleton from "@/features/expense/components/SettlementSkeleton";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/expense/settlement/$tripId")({
  component: SettlementPage,
  beforeLoad: requireAuth,
  pendingComponent: SettlementSkeleton,
});
