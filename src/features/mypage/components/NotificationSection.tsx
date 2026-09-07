import {
  Box,
  Button,
  HStack,
  Icon,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AlertTriangle, Bell } from "lucide-react";
import { colors, statusColors } from "@/shared/constants/colors";
import { useNotificationPermission } from "@/shared/hooks";
import {
  isReactNativeWebView,
  openAppNotificationSettings,
} from "@/shared/utils/nativeMessage";
import { useTripReminderToggle } from "../hooks/useTripReminderToggle";

/**
 * 마이페이지 "설정" 그룹 — 여행 리마인더 토글을 시트 없이 바로 켜고 끈다.
 * 로컬 알림은 앱에서만 동작하므로 일반 브라우저에서는 숨김
 */
export default function NotificationSection() {
  const isApp = isReactNativeWebView();
  const { enabled, toggle, isToggling } = useTripReminderToggle();
  const permission = useNotificationPermission(isApp);

  if (!isApp) return null;

  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
        설정
      </Text>
      <VStack
        gap={0}
        align="stretch"
        bg="white"
        borderRadius="xl"
        px={4}
        py={3}
        borderWidth="1px"
        borderColor="gray.200"
      >
        {/* 라벨과 스위치가 한 히트 영역 — 행 어디를 눌러도 토글된다 */}
        <Switch.Root
          checked={enabled}
          disabled={isToggling}
          onCheckedChange={(e) => void toggle(e.checked)}
          colorPalette={colors.primary.palette}
          display="flex"
          justifyContent="space-between"
          w="full"
          py={1}
        >
          <Switch.HiddenInput />
          <Switch.Label>
            <HStack gap={3}>
              <Icon as={Bell} color="gray.500" size="lg" />
              <Text fontSize="md" fontWeight="medium" color="gray.700">
                여행 리마인더
              </Text>
            </HStack>
          </Switch.Label>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>

        <Text fontSize="sm" color="gray.500" pl={9}>
          출발 7일 전 · 3일 전 · 1일 전 <br /> 당일 오전 9시에 알려드려요
        </Text>

        {permission === "denied" && (
          <HStack
            mt={3}
            px={3}
            py={2.5}
            gap={2}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={statusColors.warning.border}
            bg={statusColors.warning.bg}
          >
            <Icon as={AlertTriangle} color={statusColors.warning.text} />
            <Text fontSize="sm" color={statusColors.warning.text} flex={1}>
              기기 알림이 꺼져 있어요
            </Text>
            <Button
              size="xs"
              variant="outline"
              colorPalette={statusColors.warning.palette}
              onClick={openAppNotificationSettings}
            >
              설정 열기
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
