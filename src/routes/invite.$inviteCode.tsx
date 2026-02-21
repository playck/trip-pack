import { createFileRoute } from "@tanstack/react-router";
import InviteAcceptPage from "@/features/trip-members/InviteAcceptPage";

export const Route = createFileRoute("/invite/$inviteCode")({
  component: InviteAcceptPage,
});
