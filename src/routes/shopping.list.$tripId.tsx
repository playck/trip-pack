import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAuth } from "@/shared/utils/authGuard";

export const Route = createFileRoute("/shopping/list/$tripId")({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    throw redirect({
      to: "/packing/list/$tripId",
      params: { tripId: params.tripId },
    });
  },
});
