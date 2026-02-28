import {
  Box,
  Drawer,
  IconButton,
  Portal,
  Text,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react";
import {
  Users,
  UserPlus,
  Edit3,
  CalendarDays,
  MapPin,
  Trash2,
  X,
} from "lucide-react";
import { statusColors, customPalette } from "@/shared/constants/colors";
import { formatTripDateRange, getDuration } from "@/shared/utiles/date";

interface TripSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMembers: () => void;
  onOpenInvite: () => void;
  onOpenEditTitle: () => void;
  onOpenEditDate: () => void;
  onOpenDeleteTrip: () => void;
  tripInfo?: {
    title: string;
    regionName: string | null;
    startDate: string;
    endDate: string;
  };
  memberCount?: number;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function MenuItemRow({ icon, label, onClick }: MenuItem) {
  return (
    <HStack
      as="button"
      w="full"
      gap={3}
      py={3}
      borderRadius="lg"
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      onClick={onClick}
      css={{ touchAction: "manipulation" }}
    >
      <Box aria-hidden="true" color="gray.500" flexShrink={0}>
        {icon}
      </Box>
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
  onOpenEditTitle,
  onOpenEditDate,
  onOpenDeleteTrip,
  tripInfo,
  memberCount,
}: TripSettingsDrawerProps) {
  const handleAction = (action: () => void) => {
    action();
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
        <Drawer.Backdrop css={{ zIndex: 1200 }} />
        <Drawer.Positioner css={{ zIndex: 1201 }}>
          <Drawer.Content maxW="100%">
            <Drawer.Header px={5} pt={5} pb={3}>
              <HStack justify="space-between" w="full">
                <Text fontSize="md" fontWeight="semibold">
                  여행 설정
                </Text>
                <IconButton
                  aria-label="닫기"
                  variant="ghost"
                  size="md"
                  color="gray.500"
                  onClick={onClose}
                >
                  <X size={30} />
                </IconButton>
              </HStack>
            </Drawer.Header>
            <Drawer.Body
              px={5}
              pt={0}
              pb={0}
              display="flex"
              flexDirection="column"
              css={{ overscrollBehavior: "contain" }}
            >
              {/* 여행 요약 정보 */}
              {tripInfo && (
                <>
                  <Box bg="gray.50" borderRadius="lg" p={4} mb={4}>
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                      {tripInfo.title}
                    </Text>
                    <VStack align="stretch" gap={1.5}>
                      {tripInfo.regionName && (
                        <HStack gap={2} color="gray.600">
                          <MapPin size={15} />
                          <Text fontSize="sm">{tripInfo.regionName}</Text>
                        </HStack>
                      )}
                      <HStack gap={2} color="gray.600">
                        <CalendarDays size={15} />
                        <Text fontSize="sm">
                          {formatTripDateRange(
                            tripInfo.startDate,
                            tripInfo.endDate,
                          )}{" "}
                          ({getDuration(tripInfo.startDate, tripInfo.endDate)})
                        </Text>
                      </HStack>
                      <HStack gap={2} color="gray.600">
                        <Users size={15} />
                        <Text fontSize="sm">{memberCount ?? 0}명</Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <Separator mb={3} />
                </>
              )}

              <VStack align="stretch" gap={0} flex={1}>
                {/* 여행 설정 섹션 */}
                <Text fontSize="xs" color="gray.400" fontWeight="medium" mb={1}>
                  여행
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

                <Separator my={3} />

                {/* 일행 설정 섹션 */}
                <Text fontSize="xs" color="gray.400" fontWeight="medium" mb={1}>
                  일행 설정
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
              </VStack>

              {/* 여행 삭제 - 하단 고정 */}
              <Box pt={4} pb={5} mt="auto">
                <HStack
                  as="button"
                  w="full"
                  gap={2}
                  py={3}
                  justify="center"
                  cursor="pointer"
                  borderRadius="lg"
                  bg={customPalette.rose[50]}
                  color={statusColors.error.text}
                  _hover={{ bg: customPalette.rose[100] }}
                  onClick={() => handleAction(onOpenDeleteTrip)}
                  css={{ touchAction: "manipulation" }}
                >
                  <Box aria-hidden="true" flexShrink={0}>
                    <Trash2 size={16} />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold">
                    여행 삭제
                  </Text>
                </HStack>
              </Box>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
