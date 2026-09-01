import { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { isReactNativeWebView } from "@/shared/utils/nativeMessage";
import MenuItem from "./MenuItem";
import NotificationSettingsSheet from "./NotificationSettingsSheet";

export default function NotificationSection() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 로컬 알림은 앱에서만 동작 — 일반 브라우저에서는 진입점 자체를 숨긴다
  if (!isReactNativeWebView()) return null;

  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
        설정
      </Text>
      <VStack
        gap={0}
        bg="white"
        borderRadius="xl"
        px={4}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <MenuItem
          icon={Bell}
          label="알림 설정"
          onClick={() => setIsSheetOpen(true)}
        />
      </VStack>

      <NotificationSettingsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </Box>
  );
}
