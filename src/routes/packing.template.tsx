import { createFileRoute } from "@tanstack/react-router";
import PackingTemplatePage from "../features/packing/template/PackingTemplatePage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/packing/template")({
  component: PackingTemplatePage,
  beforeLoad: requireAuth,
});
