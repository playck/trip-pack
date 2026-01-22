import { createFileRoute } from "@tanstack/react-router";
import ChecklistDetailPage from "@/features/mypage/ChecklistDetailPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/mypage/my-checklists/$templateId")({
  component: ChecklistDetailPage,
  beforeLoad: requireAuth,
});
