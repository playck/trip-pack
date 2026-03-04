import { Box, HStack, Text } from "@chakra-ui/react";
import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

const MotionBox = motion.create(Box);

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <MotionBox
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          overflow="hidden"
        >
          <Box bg="gray.700" py={2} px={4}>
            <HStack justify="center" gap={2}>
              <WifiOff size={14} color="white" />
              <Text fontSize="xs" color="white" fontWeight="medium">
                오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.
              </Text>
            </HStack>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
