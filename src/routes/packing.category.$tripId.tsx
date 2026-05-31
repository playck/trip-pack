import { createFileRoute } from "@tanstack/react-router";
import CategoryDetailPage from "@/features/packing/detail/CategoryDetailPage";
import CategoryDetailSkeleton from "@/features/packing/detail/components/CategoryDetailSkeleton";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/packing/category/$tripId")({
  component: CategoryDetailPage,
  beforeLoad: requireAuth,
  pendingComponent: CategoryDetailSkeleton,
});
