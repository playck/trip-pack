import { createFileRoute } from "@tanstack/react-router";
import MyPage from "@/features/mypage/MyPage";

export const Route = createFileRoute("/mypage/")({
  component: MyPage,
});
