import { createFileRoute } from "@tanstack/react-router";
import PackingCreatePage from "../features/packing/create/PackingCreatePage";

export const Route = createFileRoute("/packing/create")({
  component: PackingCreatePage,
});
