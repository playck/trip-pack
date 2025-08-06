import { Box, VStack, Text, Button, HStack } from "@chakra-ui/react";
import { Plus } from "lucide-react";

import { colors, colorCombinations } from "../../shared/constants/colors";

export default function MainPage() {
  return (
    <Box w="full" py={4}>
      <VStack gap={6} align="stretch">
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
