import { Box, HStack, Text, Avatar, VStack } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js";
import { colors } from "@/shared/constants/colors";

interface ProfileCardProps {
  user: User | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
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
        <Avatar.Root size="lg" bg={colors.primary.solid} color="white">
          <Avatar.Fallback name={username} />
          <Avatar.Image />
        </Avatar.Root>

        <VStack align="start" gap={0} flex={1}>
          <HStack gap={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {username}
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            {email}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}
