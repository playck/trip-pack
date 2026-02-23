import { createFileRoute } from "@tanstack/react-router";
import ShoppingDetailPage from "@/features/shopping/detail/ShoppingDetailPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/shopping/category/$tripId")({
  component: ShoppingDetailPage,
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || "",
  }),
});
