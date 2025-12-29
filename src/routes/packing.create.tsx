import { createFileRoute } from "@tanstack/react-router";
import PackingCreatePage from "../features/packing/create/PackingCreatePage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/packing/create")({
  component: PackingCreatePage,
  beforeLoad: requireAuth,
});
