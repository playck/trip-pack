import { createFileRoute } from "@tanstack/react-router";
import PackingTemplatePage from "../features/packing/template/PackingTemplatePage";

export const Route = createFileRoute("/packing/template")({
  component: PackingTemplatePage,
});
