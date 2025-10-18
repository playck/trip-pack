import { useState, useRef } from "react";
import { Text, Timeline, Box, useDisclosure } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { MapPin, Trash2 } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import { Modal } from "@/shared/components";
import { useDeleteSchedule } from "../hooks";
import type { Schedule } from "../types";

interface SwipeableScheduleItemProps {
  schedule: Schedule;
  tripId: string;
}

const ACTION_BUTTON_WIDTH = 60; // 삭제 버튼 너비
const SWIPE_THRESHOLD = 50; // 스와이프 감지 임계값

export default function SwipeableScheduleItem({
  schedule,
  tripId,
}: SwipeableScheduleItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dragConstraintsRef = useRef(null);
  const {
    open: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD && !isOpen) {
      setIsOpen(true);
    } else if (info.offset.x > SWIPE_THRESHOLD && isOpen) {
      setIsOpen(false);
    }
  };

  const deleteScheduleMutation = useDeleteSchedule(tripId, {
    onSuccess: () => {
      onDeleteModalClose();
      setIsOpen(false);
    },
  });

  const handleDeleteConfirm = () => {
    deleteScheduleMutation.mutate(schedule.id);
  };

  return (
    <Box position="relative" overflow="hidden" ref={dragConstraintsRef}>
      <Box
        position="absolute"
        right="0"
        top="30%"
        transform="translateY(-50%)"
        w="35px"
        h="35px"
        bg="red.500"
        borderRadius="50%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        zIndex={0}
        onClick={onDeleteModalOpen}
        color="white"
      >
        <Trash2 size={16} />
      </Box>

      <motion.div
        drag="x"
        dragConstraints={{ left: -ACTION_BUTTON_WIDTH, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={{ x: isOpen ? -ACTION_BUTTON_WIDTH : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "relative",
          zIndex: 1,
          cursor: "grab",
          backgroundColor: "white",
        }}
      >
        <Box w="full">
          <Timeline.Item>
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator>
                <MapPin size={14} />
              </Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Title fontSize="md" fontWeight="semibold">
                {schedule.place_name}
              </Timeline.Title>
              <Timeline.Description fontSize="sm" color={textColors.tertiary}>
                {schedule.start_time && (
                  <Text as="span" mr={2}>
                    {schedule.start_time.slice(0, 5)}
                  </Text>
                )}
                {schedule.place_address && (
                  <Text as="span">{schedule.place_address}</Text>
                )}
              </Timeline.Description>
              {schedule.notes && (
                <Text fontSize="sm" color={textColors.subtle} mt={1}>
                  {schedule.notes}
                </Text>
              )}
            </Timeline.Content>
          </Timeline.Item>
        </Box>
      </motion.div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        title="일정 삭제"
        actions={[
          {
            label: "취소",
            onClick: onDeleteModalClose,
            variant: "outline",
            colorPalette: "neutral",
            disabled: deleteScheduleMutation.isPending,
          },
          {
            label: "삭제",
            onClick: handleDeleteConfirm,
            variant: "solid",
            colorPalette: "red",
            isLoading: deleteScheduleMutation.isPending,
            disabled: deleteScheduleMutation.isPending,
          },
        ]}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{schedule.place_name}"
          </Text>{" "}
          일정을 삭제하시겠습니까?
          <br />
          삭제된 일정은 복구할 수 없습니다.
        </Text>
      </Modal>
    </Box>
  );
}
