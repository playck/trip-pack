import { createFileRoute } from "@tanstack/react-router";
import PackingListPage from "@/features/packing/list/PackingListPage";

export const Route = createFileRoute("/packing/list/$tripId")({
  component: PackingListPage,
});
