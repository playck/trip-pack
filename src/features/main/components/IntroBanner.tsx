import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

interface IntroBannerProps {
  onCreateTrip: () => void;
}

export default function IntroBanner({ onCreateTrip }: IntroBannerProps) {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();

  return (
    <Box
      role="button"
      aria-label="여행 추가"
      onClick={isOnline ? onCreateTrip : undefined}
      py={3}
      px={5}
      bgGradient={`linear(120deg, #ffffff 0%, ${colors.primary.subtle} 100%)`}
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
      position="relative"
      overflow="hidden"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.5)"
      borderRadius="2xl"
      cursor={isOnline ? "pointer" : "not-allowed"}
      opacity={isOnline ? 1 : 0.5}
    >
      <Box
        position="absolute"
        top={-10}
        right={-10}
        w={40}
        h={40}
        bg={colors.primary.subtle}
        borderRadius="full"
        filter="blur(40px)"
        opacity={0.6}
      />
      <Box
        position="absolute"
        bottom={-10}
        left={-10}
        w={32}
        h={32}
        bg="orange.100"
        borderRadius="full"
        filter="blur(40px)"
        opacity={0.4}
      />

      <HStack
        justify="space-between"
        align="center"
        position="relative"
        zIndex={1}
      >
        <VStack align="start" gap={0}>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            반가워요, {user?.user_metadata?.username || "여행자"}님! 👋
          </Text>
          <Text
            fontSize="xl"
            fontWeight="800"
            color="gray.800"
            letterSpacing="-0.5px"
          >
            어디로 떠나시나요?
          </Text>
        </VStack>

        <Box bg="gray.900" color="white" p={2} borderRadius="full">
          <Plus size={20} strokeWidth={3} />
        </Box>
      </HStack>
    </Box>
  );
}
