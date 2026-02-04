import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { supabase } from "@/shared/service/supabase/cilent";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { colors, statusColors } from "@/shared/constants/colors";
import {
  validateLoginForm,
  handleLoginError,
  type LoginFormErrors,
} from "../validation";
import { useSocialLogin } from "../hooks/useSocialLogin";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { handleKakaoLogin, handleGoogleLogin, socialError } = useSocialLogin();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const loginFormErrors = validateLoginForm(
      formData.email,
      formData.password
    );
    setErrors(loginFormErrors);
    return Object.keys(loginFormErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError) {
        setErrors(handleLoginError(authError));
        return;
      }

      if (authData.user) {
        navigate({ to: "/main" });
      }
    } catch {
      setErrors({
        general: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Container
        maxW="md"
        h={`calc(100dvh - ${HEADER_HEIGHT}px)`}
        px={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        overflow="hidden"
        style={{ minHeight: `calc(100dvh - ${HEADER_HEIGHT}px)` }}
      >
        <VStack gap={6} align="stretch" w="full">
          <Box textAlign="center">
            <Heading size="xl" mb={1} fontWeight="800" color="gray.800">
              Trip Pack
            </Heading>
            <Text color="gray.500" fontSize="md">
              여행 준비의 시작, Trip Pack과 함께하세요
            </Text>
          </Box>

          <VStack gap={3}>
            <Button
              size="lg"
              borderRadius="xl"
              onClick={handleKakaoLogin}
              bg="#FEE500"
              color="#000000"
              fontWeight="bold"
              _active={{ bg: "#F9A825" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              w="full"
              h="50px"
              boxShadow="sm"
            >
              <Box width="20px" height="20px">
                <Text fontSize="18px">🗨️</Text>
              </Box>
              카카오로 계속하기
            </Button>

            <Button
              size="lg"
              borderRadius="xl"
              onClick={handleGoogleLogin}
              bg="white"
              color="#3c4043"
              border="1px solid"
              borderColor="gray.200"
              fontWeight="medium"
              _active={{ bg: "gray.100" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              w="full"
              h="50px"
              boxShadow="sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기
            </Button>
          </VStack>

          <Box position="relative" py={1}>
            <Box borderTop="1px solid" borderColor="gray.200" width="full" />
            <AbsoluteCenter bg="#F8F9FA" px={4}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                또는 이메일로 로그인
              </Text>
            </AbsoluteCenter>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              {(errors.general || socialError) && (
                <Box
                  p={3}
                  bg={statusColors.error.bg}
                  borderRadius="lg"
                  color={statusColors.error.text}
                  fontSize="sm"
                  fontWeight="medium"
                  textAlign="center"
                >
                  {errors.general || socialError}
                </Box>
              )}

              <Box>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    pointerEvents="none"
                    color="gray.400"
                  >
                    <Mail size={18} />
                  </Box>
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    size="lg"
                    pl={10}
                    h="50px"
                    bg="white"
                    borderRadius="xl"
                    borderColor={errors.email ? statusColors.error.hex[300] : "gray.200"}
                    _focus={{
                      borderColor: errors.email
                        ? statusColors.error.hex[400]
                        : `${colors.primary.palette}.500`,
                      boxShadow: errors.email
                        ? `0 0 0 1px ${statusColors.error.hex[400]}`
                        : `0 0 0 1px var(--chakra-colors-${colors.primary.palette}-500)`,
                      bg: "white",
                    }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                {errors.email && (
                  <Text color={statusColors.error.solid} fontSize="xs" mt={1} ml={1}>
                    {errors.email}
                  </Text>
                )}
              </Box>

              <Box>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    pointerEvents="none"
                    color="gray.400"
                  >
                    <Lock size={18} />
                  </Box>
                  <Input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    size="lg"
                    pl={10}
                    h="50px"
                    bg="white"
                    borderRadius="xl"
                    borderColor={errors.password ? statusColors.error.hex[300] : "gray.200"}
                    _focus={{
                      borderColor: errors.password
                        ? statusColors.error.hex[400]
                        : `${colors.primary.palette}.500`,
                      boxShadow: errors.password
                        ? `0 0 0 1px ${statusColors.error.hex[400]}`
                        : `0 0 0 1px var(--chakra-colors-${colors.primary.palette}-500)`,
                      bg: "white",
                    }}
                    _placeholder={{ color: "gray.400" }}
                  />
                </Box>
                {errors.password && (
                  <Text color={statusColors.error.solid} fontSize="xs" mt={1} ml={1}>
                    {errors.password}
                  </Text>
                )}
              </Box>

              <Button
                type="submit"
                size="lg"
                colorScheme={colors.primary.palette}
                borderRadius="xl"
                loading={isLoading}
                h="50px"
                fontSize="md"
                fontWeight="bold"
                mt={1}
                boxShadow="md"
                _active={{ transform: "translateY(0)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                {isLoading ? "로그인 중..." : "이메일로 로그인"}
              </Button>

              <Box textAlign="center" mt={2}>
                <Text fontSize="sm" color="gray.500">
                  아직 계정이 없으신가요?{" "}
                  <Text
                    as="button"
                    color={`${colors.primary.palette}.600`}
                    fontWeight="semibold"
                    onClick={() => navigate({ to: "/auth/signup" })}
                    _hover={{ textDecoration: "underline" }}
                  >
                    회원가입하기
                  </Text>
                </Text>
              </Box>
            </Stack>
          </form>
        </VStack>
      </Container>
    </PageLayout>
  );
}
