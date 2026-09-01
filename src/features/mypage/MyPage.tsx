import { Box, VStack } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import ProfileCard from "./components/ProfileCard";
import ActivitySection from "./components/ActivitySection";
import AccountSection from "./components/AccountSection";
import NotificationSection from "./components/NotificationSection";
import TravelHelperSection from "./components/travel-helper/TravelHelperSection";

export default function MyPage() {
  const { user, loading } = useAuth();

  return (
    <PageLayout>
      <Box py={6}>
        <VStack gap={8} align="stretch">
          <ProfileCard user={user} isLoading={loading} />
          <ActivitySection />
          <TravelHelperSection />
          <NotificationSection />
          <AccountSection />
        </VStack>
      </Box>
    </PageLayout>
  );
}
