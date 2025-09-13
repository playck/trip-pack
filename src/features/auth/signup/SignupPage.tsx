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

import PageLayout from "@/shared/components/layout/PageLayout";
import { supabase } from "@/shared/service/supabase/cilent";
import {
  validateSignupForm,
  handleSignupError,
  type SignupFormErrors,
} from "../validation";

interface SignupForm {
  email: string;
  password: string;
  username: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
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
      formData.username
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
      <Container maxW="100%" pt={8} px={6}>
        <VStack gap={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              회원가입
            </Heading>
            <Text color="gray.600">Trip Pack에 오신 것을 환영합니다!</Text>
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
                    placeholder="최소 6자리 이상"
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

                <Box>
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    유저명
                  </Text>
                  <Input
                    type="text"
                    placeholder="닉네임을 입력해주세요"
                    value={formData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    size="lg"
                    borderRadius="lg"
                    borderColor={errors.username ? "red.300" : "gray.200"}
                    _focus={{
                      borderColor: errors.username ? "red.400" : "blue.400",
                      boxShadow: errors.username
                        ? "0 0 0 1px red.400"
                        : "0 0 0 1px blue.400",
                    }}
                  />
                  {errors.username && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.username}
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
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>

                <Box textAlign="center" mt={4}>
                  <Text fontSize="sm" color="gray.600">
                    이미 계정이 있으신가요?{" "}
                    <Text
                      as="button"
                      color="blue.500"
                      fontWeight="medium"
                      onClick={() => navigate({ to: "/auth/login" })}
                    >
                      로그인하기
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
