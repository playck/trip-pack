import { useEffect, useState } from "react";
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
  ImagePlus,
  Plane,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { statusColors, customPalette } from "@/shared/constants/colors";
import { pushSheet, popSheet, useTopSheetId } from "../bottomSheetStack";
import TripImageCard from "./TripImageCard";

interface TripSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMembers: () => void;
  onOpenInvite: () => void;
  onOpenEditTitle: () => void;
  onOpenEditDate: () => void;
  onOpenDeleteTrip: () => void;
  onOpenFlight?: () => void;
  onOpenMemo?: () => void;
  onChangeImage?: () => void;
  isUploadingImage?: boolean;
  tripInfo?: {
    id: string;
    title: string;
    regionName: string | null;
    countryCode: string | null;
    startDate: string;
    endDate: string;
    imageUrl: string | null;
  };
  memberCount?: number;
}

export default function TripSettingsDrawer({
  isOpen,
  onClose,
  onOpenMembers,
  onOpenInvite,
  onOpenEditTitle,
  onOpenEditDate,
  onOpenDeleteTrip,
  onOpenFlight,
  onOpenMemo,
  onChangeImage,
  isUploadingImage,
  tripInfo,
  memberCount,
}: TripSettingsDrawerProps) {
  const handleAction = (action: () => void) => {
    action();
  };

  // BottomSheet 과 동일한 전역 stack 에 참여해, 위에 시트가 열리면 뒤로 물러난다.
  const [myId, setMyId] = useState<number | null>(null);
  const topId = useTopSheetId();
  useEffect(() => {
    if (!isOpen) return;
    const id = pushSheet();
    setMyId(id);
    return () => {
      popSheet(id);
      setMyId(null);
    };
  }, [isOpen]);
  const isHidden = myId !== null && topId !== null && myId !== topId;

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
          <Drawer.Content
            maxW="100%"
            style={{
              // 반투명 대신 스크림(brightness)으로 어둡게 — BottomSheet 과 동일
              filter: isHidden ? "brightness(0.6)" : undefined,
              pointerEvents: isHidden ? "none" : "auto",
              transition: "filter 0.15s ease-out",
            }}
          >
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
              {/* 여행 요약 이미지 카드 */}
              {tripInfo && (
                <>
                  <TripImageCard
                    tripId={tripInfo.id}
                    title={tripInfo.title}
                    regionName={tripInfo.regionName}
                    countryCode={tripInfo.countryCode}
                    startDate={tripInfo.startDate}
                    endDate={tripInfo.endDate}
                    imageUrl={tripInfo.imageUrl}
                    memberCount={memberCount ?? 0}
                    isUploading={isUploadingImage}
                  />

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
                {onChangeImage && (
                  <MenuItemRow
                    icon={<ImagePlus size={18} />}
                    label="여행 이미지 변경"
                    onClick={() => handleAction(onChangeImage)}
                  />
                )}
                {onOpenMemo && (
                  <MenuItemRow
                    icon={<StickyNote size={18} />}
                    label="여행 메모"
                    onClick={() => handleAction(onOpenMemo)}
                  />
                )}
                {onOpenFlight && (
                  <MenuItemRow
                    icon={<Plane size={18} />}
                    label="항공편 현황"
                    onClick={() => handleAction(onOpenFlight)}
                  />
                )}

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
