import { Box, VStack } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import ProfileCard from "./components/ProfileCard";
import SettingMenu from "./components/SettingMenu";

export default function MyPage() {
  const { user, loading } = useAuth();

  return (
    <PageLayout>
      <Box py={6}>
        <VStack gap={8} align="stretch">
          <ProfileCard user={user} isLoading={loading} />
          <SettingMenu />
        </VStack>
      </Box>
    </PageLayout>
  );
}
