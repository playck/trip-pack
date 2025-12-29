import { createFileRoute } from "@tanstack/react-router";
import MyPage from "@/features/mypage/MyPage";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/mypage/")({
  component: MyPage,
  beforeLoad: requireAuth,
});
