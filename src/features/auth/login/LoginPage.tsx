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
  Alert,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 입력 시 해당 필드의 에러 메시지 제거
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
      // TODO: Supabase 로그인 API 호출
      console.log("로그인 데이터:", formData);

      // 임시로 2초 딜레이 후 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 로그인 성공 후 메인 페이지로 이동
      navigate({ to: "/" });
    } catch (error) {
      setErrors({
        general:
          "로그인 중 오류가 발생했습니다. 이메일과 비밀번호를 확인해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Container maxW="100%" pt={8} px={6}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              로그인
            </Heading>
            <Text color="gray.600">Trip Pack에 다시 오신 것을 환영합니다!</Text>
          </Box>

          <Box>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {errors.general && (
                  <Alert status="error" borderRadius="md">
                    {errors.general}
                  </Alert>
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
                    isInvalid={!!errors.email}
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
                    isInvalid={!!errors.password}
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
                  isLoading={isLoading}
                  loadingText="로그인 중..."
                  mt={4}
                >
                  로그인
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
