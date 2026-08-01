import { useState, useCallback } from "react";
import {
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Box,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { Check, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { componentColors } from "@/shared/constants/colors";
import { PAYMENT_LIVE } from "@/shared/constants/app";
import {
  isReactNativeWebView,
  requestPremiumPurchase,
  restorePremiumPurchase,
} from "@/shared/utils/nativeMessage";
import { useAuth } from "@/shared/hooks/useAuth";
import { getMyTier } from "../services/api";
import {
  useSubscription,
  subscriptionQueryKey,
} from "../services/useSubscription";

const BENEFITS = [
  "여행 무제한 생성",
  "저장한 체크리스트 템플릿 무제한",
  "앞으로 추가되는 프리미엄 기능",
];

// 웹훅(서버 tier 반영)까지의 지연을 흡수하기 위한 백그라운드 재확인.
const RECONCILE_TRIES = 8;
const RECONCILE_INTERVAL_MS = 2000;

export default function SubscribePage() {
  const { user } = useAuth();
  const { isPremium, isLoading } = useSubscription(user?.id);
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<null | "purchase" | "restore">(null);
  const inApp = isReactNativeWebView();

  // 네이티브 구매/복원이 성공하면 엔타이틀먼트는 이미 검증된 상태.
  // tier를 낙관적으로 premium으로 올린 뒤, 웹훅 반영을 백그라운드로 확인(다운그레이드 없이).
  const reconcilePremium = useCallback(
    (userId: string) => {
      const key = subscriptionQueryKey(userId);
      queryClient.setQueryData(key, "premium");
      void (async () => {
        for (let i = 0; i < RECONCILE_TRIES; i++) {
          await new Promise((r) => setTimeout(r, RECONCILE_INTERVAL_MS));
          try {
            if ((await getMyTier(userId)) === "premium") {
              queryClient.setQueryData(key, "premium");
              return;
            }
          } catch {
            // 네트워크 오류 시 낙관적 값 유지
          }
        }
        queryClient.invalidateQueries({ queryKey: key });
      })();
    },
    [queryClient]
  );

  const handlePurchase = useCallback(async () => {
    if (!user?.id || pending) return;
    setPending("purchase");
    try {
      const result = await requestPremiumPurchase(user.id);
      if (result.ok) {
        reconcilePremium(user.id);
        toaster.create({
          type: "success",
          title: "프리미엄이 활성화됐어요",
          description: "이제 여행을 무제한으로 만들 수 있어요.",
          duration: 5000,
        });
      } else if (!result.cancelled) {
        toaster.create({
          type: "error",
          title: "결제를 완료하지 못했어요",
          description: result.message ?? "잠시 후 다시 시도해 주세요.",
          duration: 5000,
        });
      }
    } catch {
      toaster.create({
        type: "error",
        title: "결제 응답이 지연되고 있어요",
        description: "이미 결제됐다면 '구매 복원'을 눌러 확인해 주세요.",
        duration: 6000,
      });
    } finally {
      setPending(null);
    }
  }, [user?.id, pending, reconcilePremium]);

  const handleRestore = useCallback(async () => {
    if (!user?.id || pending) return;
    setPending("restore");
    try {
      const result = await restorePremiumPurchase(user.id);
      if (result.ok) {
        reconcilePremium(user.id);
        toaster.create({
          type: "success",
          title: "구매를 복원했어요",
          description: "프리미엄이 다시 활성화됐어요.",
          duration: 5000,
        });
      } else {
        toaster.create({
          type: "info",
          title: "복원할 구매가 없어요",
          description: result.message ?? "이 계정으로 구매한 내역이 없어요.",
          duration: 5000,
        });
      }
    } catch {
      toaster.create({
        type: "error",
        title: "복원 중 문제가 생겼어요",
        description: "잠시 후 다시 시도해 주세요.",
        duration: 5000,
      });
    } finally {
      setPending(null);
    }
  }, [user?.id, pending, reconcilePremium]);

  if (isLoading) {
    return (
      <VStack py={20} justify="center">
        <Spinner />
      </VStack>
    );
  }

  if (isPremium) {
    return (
      <VStack gap={4} px={6} py={16} maxWidth="480px" mx="auto">
        <Badge colorPalette="purple" size="lg">
          프리미엄
        </Badge>
        <Heading size="xl" textAlign="center">
          이미 프리미엄이에요
        </Heading>
        <Text color="fg.muted" textAlign="center">
          여행을 무제한으로 만들 수 있어요. 이용해 주셔서 고마워요.
        </Text>
      </VStack>
    );
  }

  const benefitsList = (
    <VStack gap={3} align="stretch">
      {BENEFITS.map((benefit) => (
        <HStack key={benefit} gap={3}>
          <Box color="purple.solid" flexShrink={0}>
            <Check size={20} />
          </Box>
          <Text>{benefit}</Text>
        </HStack>
      ))}
    </VStack>
  );

  const cta = !PAYMENT_LIVE ? (
    <Box borderWidth="1px" borderColor="border" borderRadius="lg" p={5}>
      <VStack gap={2}>
        <Text fontWeight="bold">곧 오픈해요</Text>
        <Text fontSize="sm" color="fg.muted" textAlign="center">
          프리미엄 결제를 준비하고 있어요. 준비되면 알려드릴게요.
        </Text>
      </VStack>
    </Box>
  ) : inApp ? (
    <VStack gap={2} align="stretch">
      <Button
        colorPalette={componentColors.button.primary}
        size="lg"
        width="100%"
        onClick={handlePurchase}
        loading={pending === "purchase"}
        disabled={pending !== null}
      >
        <Sparkles size={18} />
        프리미엄 잠금 해제
      </Button>
      <Button
        variant="ghost"
        size="sm"
        width="100%"
        onClick={handleRestore}
        loading={pending === "restore"}
        disabled={pending !== null}
      >
        구매 복원
      </Button>
    </VStack>
  ) : (
    <Box borderWidth="1px" borderColor="border" borderRadius="lg" p={5}>
      <VStack gap={2}>
        <Text fontWeight="bold">앱에서 구매할 수 있어요</Text>
        <Text fontSize="sm" color="fg.muted" textAlign="center">
          프리미엄 결제는 Trip Pack 앱에서 진행돼요. 앱을 열어 프리미엄을 잠금
          해제해 주세요.
        </Text>
      </VStack>
    </Box>
  );

  return (
    <VStack gap={6} px={6} py={10} maxWidth="480px" mx="auto" align="stretch">
      <VStack gap={3} align="stretch">
        <Badge alignSelf="flex-start" colorPalette="purple">
          프리미엄
        </Badge>
        <Heading size="2xl" lineHeight="1.3">
          한 번의 결제로
          <br />
          여행을 무제한으로
        </Heading>
        <Text color="fg.muted" fontSize="md">
          무료 플랜은 여행 3개까지 만들 수 있어요. 프리미엄은 한 번만 결제하면
          평생 무제한이에요.
        </Text>
      </VStack>

      {benefitsList}

      {cta}

      {PAYMENT_LIVE && (
        <Text fontSize="xs" color="fg.muted" textAlign="center">
          한 번 결제로 영구 이용. 자동 갱신이 없어요.
        </Text>
      )}
    </VStack>
  );
}
