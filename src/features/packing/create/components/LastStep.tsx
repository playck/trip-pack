import { useEffect } from "react";
import { Text, VStack, Box } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import Lottie from "lottie-react";
import animationData from "@/assets/lotties/animated-bot.json";

import useGenerateCheckList from "../hooks/useGenerateCheckList";
import { packingCreateAtom } from "../store/packingCreateAtom";

export default function LastStep() {
  const [packingCreateState, setPackingCreateState] =
    useAtom(packingCreateAtom);
  const navigate = useNavigate();
  const { handleSetUpCheckList } = useGenerateCheckList(packingCreateState);

  useEffect(() => {
    const checkListResult = handleSetUpCheckList();

    setPackingCreateState((prev) => ({
      ...prev,
      generatedCheckList: checkListResult,
    }));

    const timer = setTimeout(() => {
      navigate({ to: "/packing" });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

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
