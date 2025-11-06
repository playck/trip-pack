import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Box, Spinner } from "@chakra-ui/react";
import { useAuth } from "@/shared/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    // 스플래시로 변경 예정
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (user) {
    return <Navigate to="/main" />;
  }

  return <Navigate to="/auth/login" />;
}
