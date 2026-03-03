import { VStack, Text, Box, HStack } from "@chakra-ui/react";
import { APP_NAME, APP_VERSION } from "@/shared/constants/app";
import { colors } from "@/shared/constants/colors";
import BottomSheet from "@/shared/components/BottomSheet";

interface AboutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutSheet({ isOpen, onClose }: AboutSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="앱 정보">
      <VStack gap={6} py={4} align="center">
        <VStack gap={1}>
          <Text fontSize="2xl" fontWeight="bold" color={colors.primary.fg}>
            {APP_NAME}
          </Text>
          <Text fontSize="sm" color="gray.500">
            여행 준비의 시작
          </Text>
        </VStack>

        <Box
          w="full"
          bg="gray.50"
          borderRadius="xl"
          p={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <VStack gap={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">
                버전
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {APP_VERSION}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Text fontSize="xs" color="gray.400">
          &copy; 2026 {APP_NAME}. All rights reserved.
        </Text>
      </VStack>
    </BottomSheet>
  );
}
