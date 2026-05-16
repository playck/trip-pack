import { AlertTriangle, Home, RotateCw } from "lucide-react";
import React, { useEffect } from "react";
import { Box, Button, VStack, Text, Container } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import LoadingSpinner from "./LoadingSpinner";

interface ErrorLayoutProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function GlobalErrorFallback({
  error,
  reset,
}: ErrorComponentProps) {
  const router = useRouter();
  const errorMessage = error?.message || "알 수 없는 오류가 발생했습니다.";

  const isAuthError =
    errorMessage.includes("인증") ||
    errorMessage.includes("Auth") ||
    errorMessage.includes("session") ||
    errorMessage.includes("로그인");

  const goToHome = async () => {
    router.invalidate();
    router.navigate({ to: "/" });
  };

  const goToLogin = () => {
    router.navigate({ to: "/auth/login" });
  };

  useEffect(() => {
    if (isAuthError) {
      goToLogin();
      return;
    }
    if (error) {
      Sentry.captureException(error);
    }
  }, [isAuthError, error]);

  const handleRetry = () => {
    reset();
    router.invalidate();
  };

  const ErrorLayout = ({ title, description, children }: ErrorLayoutProps) => (
    <Container
      centerContent
      maxW="container.sm"
      h="100vh"
      justifyContent="center"
      pb="20vh"
    >
      <VStack gap={6} textAlign="center" w="full" maxW="md">
        <Box
          p={6}
          borderRadius="full"
          bg="red.50"
          color="red.500"
          border="1px solid"
          borderColor="red.100"
        >
          <AlertTriangle size={48} />
        </Box>

        <VStack gap={2}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {title}
          </Text>
          {description && (
            <Text
              color="gray.500"
              fontSize="md"
              lineHeight="1.6"
              whiteSpace="pre-line"
            >
              {description}
            </Text>
          )}
        </VStack>

        <VStack gap={3} w="full">
          {children}
        </VStack>
      </VStack>
    </Container>
  );

  // 인증 에러 처리 (로딩 표시 후 자동 이동)
  if (isAuthError) {
    return <LoadingSpinner fullScreen centered />;
  }

  // 기본 에러 처리
  return (
    <ErrorLayout
      title="문제가 발생했습니다"
      description={
        "예기치 않은 오류가 발생했습니다.\n잠시 후 다시 시도하거나 홈으로 이동해주세요."
      }
    >
      <Button
        colorPalette="gray"
        variant="outline"
        size="lg"
        w="full"
        onClick={handleRetry}
      >
        <RotateCw size={20} />
        다시 시도
      </Button>
      <Button colorPalette="teal" size="lg" w="full" onClick={goToHome}>
        <Home size={20} />
        홈으로 이동
      </Button>
    </ErrorLayout>
  );
}
