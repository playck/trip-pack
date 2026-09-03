import { Box, HStack, Text, Avatar, VStack, Skeleton } from "@chakra-ui/react";
import { Crown } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { colors } from "@/shared/constants/colors";

interface ProfileCardProps {
  user: User | null;
  isLoading?: boolean;
  isPremium?: boolean;
}

function PremiumBadge() {
  return (
    <HStack
      gap={1}
      bg={colors.primary.subtle}
      borderWidth="1px"
      borderColor={colors.primary.muted}
      borderRadius="full"
      px={2}
      py={0.5}
      flexShrink={0}
    >
      <Box color={colors.primary.solid} display="flex">
        <Crown size={12} strokeWidth={2.4} />
      </Box>
      <Text fontSize="xs" fontWeight="bold" color={colors.primary.fg}>
        프리미엄
      </Text>
    </HStack>
  );
}

export default function ProfileCard({
  user,
  isLoading = false,
  isPremium = false,
}: ProfileCardProps) {
  const username = user?.user_metadata?.username || "여행자";
  const email = user?.email || "";

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="2xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
    >
      <HStack gap={4}>
        {isLoading ? (
          <Skeleton width="12" height="12" borderRadius="full" />
        ) : (
          <Avatar.Root size="lg" bg={colors.primary.solid} color="white">
            <Avatar.Fallback name={username} />
            <Avatar.Image />
          </Avatar.Root>
        )}

        <VStack align="start" gap={1} flex={1}>
          <HStack gap={2}>
            {isLoading ? (
              <Skeleton height="28px" width="100px" />
            ) : (
              <>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  lineHeight="28px"
                >
                  {username}
                </Text>
                {isPremium && <PremiumBadge />}
              </>
            )}
          </HStack>
          {isLoading ? (
            <Skeleton height="20px" width="150px" />
          ) : (
            <Text fontSize="sm" color="gray.500" lineHeight="20px">
              {email}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}
