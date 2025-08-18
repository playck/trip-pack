import PackingPage from "@/features/packing/main/PackingPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/packing")({
  component: PackingPage,
});
