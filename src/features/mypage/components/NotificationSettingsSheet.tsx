import {
  Button,
  HStack,
  Icon,
  Separator,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AlertTriangle, Bell, Users } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors, statusColors } from "@/shared/constants/colors";
import { useNotificationPermission } from "@/shared/hooks";
import { openAppNotificationSettings } from "@/shared/utils/nativeMessage";
import { useTripReminderToggle } from "../hooks/useTripReminderToggle";

interface NotificationSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettingsSheet({
  isOpen,
  onClose,
}: NotificationSettingsSheetProps) {
  const { enabled, toggle, isToggling } = useTripReminderToggle();
  const permission = useNotificationPermission(isOpen);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="알림 설정">
      <VStack align="stretch" gap={0} pb={6}>
        <HStack justify="space-between" py={2}>
          <HStack gap={3}>
            <Icon as={Bell} color="gray.500" size="lg" />
            <Text fontSize="md" fontWeight="medium" color="gray.800">
              여행 리마인더
            </Text>
          </HStack>
          <Switch.Root
            checked={enabled}
            disabled={isToggling}
            onCheckedChange={(e) => void toggle(e.checked)}
            colorPalette={colors.primary.palette}
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch.Root>
        </HStack>

        <VStack align="flex-start" gap={0} pl={9}>
          <Text fontSize="sm" color="gray.500">
            출발 7일 전 · 3일 전 · 1일 전 · 당일
          </Text>
          <Text fontSize="sm" color="gray.500">
            오전 9시에 알려드려요
          </Text>
        </VStack>

        {permission === "denied" && (
          <HStack
            mt={4}
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

        <Separator my={4} />

        <HStack justify="space-between" opacity={0.45}>
          <HStack gap={3}>
            <Icon as={Users} color="gray.500" size="lg" />
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              일행 활동 알림
            </Text>
          </HStack>
          <Text
            fontSize="xs"
            color="gray.500"
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="full"
            px={2}
            py={0.5}
          >
            곧 제공
          </Text>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
