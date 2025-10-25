import { useState, useRef } from "react";
import { Text, Timeline, Box, useDisclosure } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { MapPin, StickyNote, Trash2 } from "lucide-react";
import { textColors } from "@/shared/constants/colors";
import { DeleteScheduleModal } from "./";
import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";

interface SwipeableScheduleItemProps {
  schedule: Schedule;
  tripId: string;
  onScheduleClick?: (schedule: Schedule) => void;
}

const ACTION_BUTTON_WIDTH = 60; // 삭제 버튼 너비
const SWIPE_THRESHOLD = 50; // 스와이프 감지 임계값

export default function SwipeableScheduleItem({
  schedule,
  tripId,
  onScheduleClick,
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

  const handleDeleteSuccess = () => {
    setIsOpen(false);
  };

  const isScheduleMemo = isMemo(schedule);

  return (
    <Box position="relative" overflow="hidden" ref={dragConstraintsRef}>
      <Box
        position="absolute"
        right="0"
        top="50%"
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
                {isScheduleMemo ? (
                  <StickyNote size={14} />
                ) : (
                  <MapPin size={14} />
                )}
              </Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content onClick={() => onScheduleClick?.(schedule)}>
              <Timeline.Title fontSize="md" fontWeight="semibold">
                {schedule.place_name}
              </Timeline.Title>
              {!isScheduleMemo && (
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
              )}
              {!isScheduleMemo && schedule.notes && (
                <Text fontSize="sm" color={textColors.subtle} mt={1}>
                  {schedule.notes}
                </Text>
              )}
            </Timeline.Content>
          </Timeline.Item>
        </Box>
      </motion.div>

      {/* 삭제 확인 모달 */}
      <DeleteScheduleModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        schedule={schedule}
        tripId={tripId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </Box>
  );
}
