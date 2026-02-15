import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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

function buildLoadingMessages(
  regionName: string | undefined,
  tripTypes: string[]
): string[] {
  const destination = regionName ?? "여행";
  const messages = [`${destination} 체크리스트를 만들고 있어요...`];

  if (tripTypes.length > 0) {
    messages.push(`${tripTypes.join(", ")} 여행에 맞는 아이템을 골라볼게요`);
  } else {
    messages.push("여행에 꼭 필요한 아이템을 골라볼게요");
  }

  messages.push("여행 정보를 저장하고 있어요");

  return messages;
}

export default function LastStep() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packingCreateState, setPackingCreateState] =
    useAtom(packingCreateAtom);
  const [message, setMessage] = useState("");
  const [subMessage, setSubMessage] = useState("잠시만 기다려 주세요..!");
  const { handleSetUpCheckList } = useGenerateCheckList(packingCreateState);

  const hasExecutedRef = useRef(false);
  const messageIndexRef = useRef(0);

  const completePackingState = useMemo(() => {
    const generatedCheckList = handleSetUpCheckList();
    return {
      ...packingCreateState,
      generatedCheckList,
      tripTitle: packingCreateState.region?.name ?? "",
    };
  }, [packingCreateState, handleSetUpCheckList]);

  const totalItemCount = useMemo(() => {
    const list = completePackingState.generatedCheckList;
    if (!list) return 0;
    return list.reduce((sum, cat) => sum + cat.items.length, 0);
  }, [completePackingState.generatedCheckList]);

  const loadingMessages = useMemo(
    () =>
      buildLoadingMessages(
        packingCreateState.region?.name,
        packingCreateState.tripTypes
      ),
    [packingCreateState.region?.name, packingCreateState.tripTypes]
  );

  // 초기 메시지 설정
  useEffect(() => {
    if (loadingMessages.length > 0) {
      setMessage(loadingMessages[0]);
    }
  }, [loadingMessages]);

  // 메시지 순차 전환 (1.1초 간격)
  useEffect(() => {
    const timer = setInterval(() => {
      messageIndexRef.current += 1;
      const idx = messageIndexRef.current;

      if (idx < loadingMessages.length) {
        setMessage(loadingMessages[idx]);
      }
    }, 1100);

    return () => clearInterval(timer);
  }, [loadingMessages]);

  const handleSuccess = useCallback(
    (_: unknown, tripId: string) => {
      const categoryCount =
        completePackingState.generatedCheckList?.length ?? 0;
      setMessage(
        `완료! ${categoryCount}개 카테고리, ${totalItemCount}개 아이템을 준비했어요`
      );
      setSubMessage("곧 체크리스트로 이동합니다");

      setTimeout(() => {
        setPackingCreateState(INITIAL_PACKING_CREATE_STATE);
        navigate({
          to: "/packing/list/$tripId",
          params: { tripId },
          search: { tripTitle: packingCreateState.region?.name ?? "" },
        });
      }, 1500);
    },
    [
      completePackingState.generatedCheckList,
      totalItemCount,
      setPackingCreateState,
      navigate,
      packingCreateState.region?.name,
    ]
  );

  const handleError = useCallback(() => {
    setMessage("오류가 발생했습니다");
    setSubMessage("잠시 후 다시 시도해 주세요");
    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
  }, [navigate]);

  const { mutate: createTripMutation } = useCreateTrip({
    packingCreateState: completePackingState,
    userId: user?.id ?? "",
    onSuccess: handleSuccess,
    onError: handleError,
  });

  useEffect(() => {
    if (hasExecutedRef.current) return;
    if (!user?.id) return;

    hasExecutedRef.current = true;

    try {
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
        <Text
          fontSize="xl"
          fontWeight="semibold"
          textAlign="center"
          lineHeight="1.4"
        >
          {message}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {subMessage}
        </Text>
      </VStack>
    </VStack>
  );
}
