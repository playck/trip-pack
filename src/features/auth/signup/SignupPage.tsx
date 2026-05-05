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
import { Mail, Lock, User } from "lucide-react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { supabase } from "@/shared/service/supabase/cilent";
import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { colors, statusColors } from "@/shared/constants/colors";
import { LEGAL_URLS } from "@/shared/constants/app";
import { openUrl } from "@/shared/utils/nativeMessage";
import {
  validateSignupForm,
  handleSignupError,
  type SignupFormErrors,
} from "../validation";
import { useSocialLogin } from "../hooks/useSocialLogin";

interface SignupForm {
  email: string;
  password: string;
  username: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleKakaoLogin, handleAppleLogin, socialError } = useSocialLogin();

  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = validateSignupForm(
      formData.email,
      formData.password,
      formData.username,
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SignupForm, value: string) => {
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
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (authError) {
        setErrors(handleSignupError(authError));
        return;
      }

      alert("회원가입이 완료되었습니다! 바로 로그인해주세요.");
      navigate({ to: "/auth/login" });
    } catch {
      setErrors({
        general: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
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
        <VStack gap={5} align="stretch" w="full">
          <Box textAlign="center">
            <Heading size="xl" mb={1} fontWeight="800" color="gray.800">
              회원가입
            </Heading>
            <Text color="gray.500" fontSize="md">
              Trip Pack에 오신 것을 환영합니다!
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
              카카오로 시작하기
            </Button>

            <Button
              size="lg"
              borderRadius="xl"
              onClick={handleAppleLogin}
              bg="black"
              color="white"
              fontWeight="medium"
              _active={{ bg: "gray.800" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              w="full"
              h="50px"
              boxShadow="sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.86-3.08.43-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.43C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple로 시작하기
            </Button>
          </VStack>

          <Box position="relative" py={1}>
            <Box borderTop="1px solid" borderColor="gray.200" width="full" />
            <AbsoluteCenter bg="#F8F9FA" px={4}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                또는 이메일로 가입
              </Text>
            </AbsoluteCenter>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack gap={3}>
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
                    placeholder="이메일 (example@email.com)"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    size="lg"
                    pl={10}
                    h="50px"
                    bg="white"
                    borderRadius="xl"
                    borderColor={
                      errors.email ? statusColors.error.hex[300] : "gray.200"
                    }
                    _focus={{
                      borderColor: errors.email
                        ? statusColors.error.hex[400]
                        : `${colors.primary.palette}.500`,
                      boxShadow: errors.email
                        ? `0 0 0 1px ${statusColors.error.hex[400]}`
                        : `0 0 0 1px var(--chakra-colors-${colors.primary.palette}-500)`,
                      bg: "white",
                    }}
                  />
                </Box>
                {errors.email && (
                  <Text
                    color={statusColors.error.solid}
                    fontSize="xs"
                    mt={1}
                    ml={1}
                  >
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
                    autoComplete="new-password"
                    placeholder="비밀번호 (6자리 이상)"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    size="lg"
                    pl={10}
                    h="50px"
                    bg="white"
                    borderRadius="xl"
                    borderColor={
                      errors.password ? statusColors.error.hex[300] : "gray.200"
                    }
                    _focus={{
                      borderColor: errors.password
                        ? statusColors.error.hex[400]
                        : `${colors.primary.palette}.500`,
                      boxShadow: errors.password
                        ? `0 0 0 1px ${statusColors.error.hex[400]}`
                        : `0 0 0 1px var(--chakra-colors-${colors.primary.palette}-500)`,
                      bg: "white",
                    }}
                  />
                </Box>
                {errors.password && (
                  <Text
                    color={statusColors.error.solid}
                    fontSize="xs"
                    mt={1}
                    ml={1}
                  >
                    {errors.password}
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
                    <User size={18} />
                  </Box>
                  <Input
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="유저명(닉네임)"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    size="lg"
                    pl={10}
                    h="50px"
                    bg="white"
                    borderRadius="xl"
                    borderColor={
                      errors.username ? statusColors.error.hex[300] : "gray.200"
                    }
                    _focus={{
                      borderColor: errors.username
                        ? statusColors.error.hex[400]
                        : `${colors.primary.palette}.500`,
                      boxShadow: errors.username
                        ? `0 0 0 1px ${statusColors.error.hex[400]}`
                        : `0 0 0 1px var(--chakra-colors-${colors.primary.palette}-500)`,
                      bg: "white",
                    }}
                  />
                </Box>
                {errors.username && (
                  <Text
                    color={statusColors.error.solid}
                    fontSize="xs"
                    mt={1}
                    ml={1}
                  >
                    {errors.username}
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
                {isLoading ? "가입 중..." : "이메일로 회원가입"}
              </Button>

              <Box textAlign="center" mt={2}>
                <Text fontSize="sm" color="gray.500">
                  이미 계정이 있으신가요?{" "}
                  <Text
                    as="button"
                    color={`${colors.primary.palette}.600`}
                    fontWeight="semibold"
                    onClick={() => navigate({ to: "/auth/login" })}
                    _hover={{ textDecoration: "underline" }}
                  >
                    로그인하기
                  </Text>
                </Text>
              </Box>

              <Box textAlign="center" mt={1}>
                <Text fontSize="xs" color="gray.400">
                  가입 시{" "}
                  <Text
                    as="button"
                    color="gray.500"
                    textDecoration="underline"
                    onClick={() =>
                      window.ReactNativeWebView
                        ? openUrl(LEGAL_URLS.TERMS_OF_SERVICE)
                        : window.open(LEGAL_URLS.TERMS_OF_SERVICE, "_blank")
                    }
                  >
                    이용약관
                  </Text>
                  {" 및 "}
                  <Text
                    as="button"
                    color="gray.500"
                    textDecoration="underline"
                    onClick={() =>
                      window.ReactNativeWebView
                        ? openUrl(LEGAL_URLS.PRIVACY_POLICY)
                        : window.open(LEGAL_URLS.PRIVACY_POLICY, "_blank")
                    }
                  >
                    개인정보 처리방침
                  </Text>
                  에 동의하게 됩니다.
                </Text>
              </Box>
            </Stack>
          </form>
        </VStack>
      </Container>
    </PageLayout>
  );
}
