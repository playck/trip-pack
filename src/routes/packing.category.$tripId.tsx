import { createFileRoute } from "@tanstack/react-router";
import CategoryDetailPage from "@/features/packing/detail/CategoryDetailPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/packing/category/$tripId")({
  component: CategoryDetailPage,
  beforeLoad: requireAuth,
});
