import { createFileRoute } from "@tanstack/react-router";
import PackingListPage from "@/features/packing/list/PackingListPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/packing/list/$tripId")({
  component: PackingListPage,
  beforeLoad: requireAuth,
});
