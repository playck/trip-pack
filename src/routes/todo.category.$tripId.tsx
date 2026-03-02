import { createFileRoute } from "@tanstack/react-router";
import TodoDetailPage from "@/features/todo/detail/TodoDetailPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/todo/category/$tripId")({
  component: TodoDetailPage,
  beforeLoad: requireAuth,
  validateSearch: (search: Record<string, unknown>) => ({
    categoryId: (search.categoryId as string) || "",
  }),
});
