import { Text, VStack, Box } from "@chakra-ui/react";
import Lottie from "lottie-react";
import animationData from "@/assets/lotties/animated-bot.json";

export default function LastStep() {
  return (
    <VStack
      gap={6}
      alignItems="center"
      justifyContent="center"
      h="calc(100vh - 240px)"
    >
      <Box w="240px" h="240px">
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
      <VStack gap={2}>
        <Text fontSize="2xl" fontWeight="semibold">
          체크리스트를 생성 중입니다
        </Text>
        <Text fontSize="sm" color="gray.500">
          잠시만 기다려 주세요..! ㅎㅅㅎ
        </Text>
      </VStack>
    </VStack>
  );
}
