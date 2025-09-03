import { createFileRoute } from "@tanstack/react-router";
import CategoryDetailPage from "@/features/packing/detail/CategoryDetailPage";

export const Route = createFileRoute("/packing/category/$tripId")({
  component: CategoryDetailPage,
});
