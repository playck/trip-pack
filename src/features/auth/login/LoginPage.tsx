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
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import type { Provider } from "@supabase/supabase-js";

import PageLayout from "@/shared/components/layout/PageLayout";
import { supabase } from "@/shared/service/supabase/cilent";
import {
  validateLoginForm,
  handleLoginError,
  type LoginFormErrors,
} from "../validation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "kakao" as Provider,
        options: {
          redirectTo: window.location.origin,
          queryParams: { prompt: "login" },
        },
      });
    } catch {
      setErrors({ general: "카카오 로그인 중 오류가 발생했습니다." });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateLoginForm(formData.email, formData.password);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        navigate({ to: "/" });
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
      <Container maxW="100%" pt={8} px={6}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              로그인
            </Heading>
            <Text color="gray.600">Trip Pack에 다시 오신 것을 환영합니다!</Text>
          </Box>

          <Box>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                {errors.general && (
                  <Box
                    p={3}
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    borderRadius="md"
                    color="red.700"
                  >
                    {errors.general}
                  </Box>
                )}

                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    이메일
                  </Text>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    size="lg"
                    borderRadius="lg"
                    borderColor={errors.email ? "red.300" : "gray.200"}
                    _focus={{
                      borderColor: errors.email ? "red.400" : "blue.400",
                      boxShadow: errors.email
                        ? "0 0 0 1px red.400"
                        : "0 0 0 1px blue.400",
                    }}
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.email}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    비밀번호
                  </Text>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    size="lg"
                    borderRadius="lg"
                    borderColor={errors.password ? "red.300" : "gray.200"}
                    _focus={{
                      borderColor: errors.password ? "red.400" : "blue.400",
                      boxShadow: errors.password
                        ? "0 0 0 1px red.400"
                        : "0 0 0 1px blue.400",
                    }}
                  />
                  {errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </Box>

                <Button
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  borderRadius="lg"
                  loading={isLoading}
                  mt={4}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                <Button
                  size="lg"
                  borderRadius="lg"
                  onClick={handleKakaoLogin}
                  bg="#FEE500"
                  color="#000000"
                  fontWeight="bold"
                  _active={{
                    bg: "#F9A825",
                  }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    width="20px"
                    height="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="16px">🗨️</Text>
                  </Box>
                  카카오로 계속하기
                </Button>

                <Box textAlign="center" mt={4}>
                  <Text fontSize="sm" color="gray.600">
                    아직 계정이 없으신가요?{" "}
                    <Text
                      as="button"
                      color="blue.500"
                      fontWeight="medium"
                      onClick={() => navigate({ to: "/auth/signup" })}
                    >
                      회원가입하기
                    </Text>
                  </Text>
                </Box>
              </Stack>
            </form>
          </Box>
        </VStack>
      </Container>
    </PageLayout>
  );
}
