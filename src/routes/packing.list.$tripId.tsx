import { createFileRoute } from "@tanstack/react-router";
import PackingListPage from "@/features/packing/list/PackingListPage";

export const Route = createFileRoute("/packing/list/$tripId")({
  component: PackingListPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tripTitle: search.tripTitle as string | undefined,
  }),
});
