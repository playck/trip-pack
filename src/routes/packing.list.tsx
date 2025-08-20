import PackingListPage from "@/features/packing/\blist/PackingListPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/packing/list")({
  component: PackingListPage,
});
