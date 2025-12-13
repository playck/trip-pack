import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Text, VStack, Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import Lottie from "lottie-react";

import animationData from "@/assets/lotties/animated-bot.json";
import { useAuth } from "@/shared/hooks/useAuth";

import useGenerateCheckList from "../hooks/useGenerateCheckList";
import {
  packingCreateAtom,
  INITIAL_PACKING_CREATE_STATE,
} from "../store/packingCreateAtom";
import { useCreateTrip } from "../services/useCreateTrip";

export default function LastStep() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packingCreateState, setPackingCreateState] =
    useAtom(packingCreateAtom);
  const [message, setMessage] = useState("체크리스트를 생성 중입니다");
  const { handleSetUpCheckList } = useGenerateCheckList(packingCreateState);

  const hasExecutedRef = useRef(false);

  const completePackingState = useMemo(() => {
    const generatedCheckList = handleSetUpCheckList();
    return {
      ...packingCreateState,
      generatedCheckList,
      tripTitle: packingCreateState.region?.name ?? "",
    };
  }, [packingCreateState, handleSetUpCheckList]);

  const { mutate: createTripMutation } = useCreateTrip({
    packingCreateState: completePackingState,
    userId: user?.id ?? "",
    onSuccess: (_, tripId) => {
      setMessage("완료되었습니다!");
      setTimeout(() => {
        setPackingCreateState(INITIAL_PACKING_CREATE_STATE);
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
          search: { tripTitle: packingCreateState.region?.name ?? "" },
        });
      }, 1500);
    },
    onError: () => {
      setMessage("오류가 발생했습니다");
      setTimeout(() => {
        navigate({ to: "/" });
      }, 2000);
    },
  });

  useEffect(() => {
    if (hasExecutedRef.current) return;
    if (!user?.id) return;

    hasExecutedRef.current = true;

    try {
      setMessage("여행 정보를 저장 중입니다");
      createTripMutation();
    } catch (error) {
      console.error("데이터 처리 중 오류:", error);
      setMessage("오류가 발생했습니다");
      setTimeout(() => navigate({ to: "/" }), 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
          {message}
        </Text>
        <Text fontSize="sm" color="gray.500">
          잠시만 기다려 주세요..! ㅎㅅㅎ
        </Text>
      </VStack>
    </VStack>
  );
}
