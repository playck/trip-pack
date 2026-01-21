import { createFileRoute } from "@tanstack/react-router";
import MyChecklistsPage from "@/features/mypage/MyChecklistsPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/mypage/my-checklists")({
  component: MyChecklistsPage,
  beforeLoad: requireAuth,
});
