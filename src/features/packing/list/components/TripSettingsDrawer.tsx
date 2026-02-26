import { Drawer, Portal, Text, VStack, HStack, Separator } from "@chakra-ui/react";
import {
  Users,
  UserPlus,
  Share2,
  Edit3,
  CalendarDays,
  Trash2,
} from "lucide-react";
import { statusColors } from "@/shared/constants/colors";

interface TripSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMembers: () => void;
  onOpenInvite: () => void;
  onOpenShare: () => void;
  onOpenEditTitle: () => void;
  onOpenEditDate: () => void;
  onOpenDeleteTrip: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

function MenuItemRow({ icon, label, onClick, color }: MenuItem) {
  return (
    <HStack
      as="button"
      w="full"
      gap={3}
      py={3}
      px={1}
      cursor="pointer"
      borderRadius="md"
      _hover={{ bg: "gray.50" }}
      onClick={onClick}
      color={color}
    >
      {icon}
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </HStack>
  );
}

export default function TripSettingsDrawer({
  isOpen,
  onClose,
  onOpenMembers,
  onOpenInvite,
  onOpenShare,
  onOpenEditTitle,
  onOpenEditDate,
  onOpenDeleteTrip,
}: TripSettingsDrawerProps) {
  const handleAction = (action: () => void) => {
    onClose();
    setTimeout(action, 200);
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW="280px">
            <Drawer.Header px={4} pt={5} pb={3}>
              <Text fontSize="md" fontWeight="semibold">
                여행 설정
              </Text>
            </Drawer.Header>
            <Drawer.Body px={4} pt={0}>
              <VStack align="stretch" gap={0}>
                {/* 일행 섹션 */}
                <Text fontSize="xs" color="gray.400" mb={1}>
                  일행
                </Text>
                <MenuItemRow
                  icon={<Users size={18} />}
                  label="일행 목록"
                  onClick={() => handleAction(onOpenMembers)}
                />
                <MenuItemRow
                  icon={<UserPlus size={18} />}
                  label="일행 초대"
                  onClick={() => handleAction(onOpenInvite)}
                />

                <Separator my={2} />

                {/* 공유 섹션 */}
                <Text fontSize="xs" color="gray.400" mb={1}>
                  공유
                </Text>
                <MenuItemRow
                  icon={<Share2 size={18} />}
                  label="체크리스트 공유"
                  onClick={() => handleAction(onOpenShare)}
                />

                <Separator my={2} />

                {/* 여행 설정 섹션 */}
                <Text fontSize="xs" color="gray.400" mb={1}>
                  여행 설정
                </Text>
                <MenuItemRow
                  icon={<Edit3 size={18} />}
                  label="여행 제목 수정"
                  onClick={() => handleAction(onOpenEditTitle)}
                />
                <MenuItemRow
                  icon={<CalendarDays size={18} />}
                  label="여행 기간 수정"
                  onClick={() => handleAction(onOpenEditDate)}
                />
                <MenuItemRow
                  icon={<Trash2 size={18} />}
                  label="여행 삭제"
                  onClick={() => handleAction(onOpenDeleteTrip)}
                  color={statusColors.error.text}
                />
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
