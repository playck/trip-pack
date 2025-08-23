import { Box, VStack, Text, Button, HStack } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { colors, colorCombinations } from "../../shared/constants/colors";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <Box w="full" py={4}>
      <VStack gap={6} align="stretch">
        {/* 회원가입/로그인 버튼 */}
        <HStack gap={3} justify="end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/auth/login" })}
          >
            로그인
          </Button>
          <Button
            colorPalette={colors.primary.palette}
            size="sm"
            onClick={() => navigate({ to: "/auth/signup" })}
          >
            회원가입
          </Button>
        </HStack>
        <Box
          p={6}
          bg={colorCombinations.defaultCard.background}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={colorCombinations.defaultCard.border}
          position="relative"
          overflow="hidden"
        >
          <VStack gap={4} align="start">
            <Box>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={colorCombinations.defaultCard.text}
                opacity={0.8}
              >
                종진님, 어디로 떠나시나요?
              </Text>
            </Box>

            <Button colorPalette={colors.primary.palette} size="lg" w="full">
              <HStack gap={2}>
                <Plus size={20} />
                <Text>새 여행 계획 시작하기</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
