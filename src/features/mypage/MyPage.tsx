import { Box, VStack } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import ProfileCard from "./components/ProfileCard";
import SettingMenu from "./components/SettingMenu";

export default function MyPage() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <Box py={6}>
        <VStack gap={8} align="stretch">
          <ProfileCard user={user} />
          <SettingMenu />
        </VStack>
      </Box>
    </PageLayout>
  );
}
