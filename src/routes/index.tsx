import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen centered />;
  }

  if (user) {
    return <Navigate to="/main" />;
  }

  return <Navigate to="/auth/login" />;
}
