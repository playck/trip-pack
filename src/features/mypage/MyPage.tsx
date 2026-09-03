import { Box, VStack } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import { PAYMENT_LIVE } from "@/shared/constants/app";
import { useSubscription } from "@/features/subscription/services/useSubscription";
import ProfileCard from "./components/ProfileCard";
import ActivitySection from "./components/ActivitySection";
import AccountSection from "./components/AccountSection";
import NotificationSection from "./components/NotificationSection";
import TravelHelperSection from "./components/travel-helper/TravelHelperSection";

export default function MyPage() {
  const { user, loading } = useAuth();
  // 결제 미오픈 시 불필요한 tier 조회 방지 (캐싱 비용 전략).
  const { isPremium } = useSubscription(user?.id, { enabled: PAYMENT_LIVE });

  return (
    <PageLayout>
      <Box py={6}>
        <VStack gap={8} align="stretch">
          <ProfileCard
            user={user}
            isLoading={loading}
            isPremium={PAYMENT_LIVE && isPremium}
          />
          <ActivitySection />
          <TravelHelperSection />
          <NotificationSection />
          <AccountSection isPremium={isPremium} />
        </VStack>
      </Box>
    </PageLayout>
  );
}
