import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Box, useDisclosure } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { DeleteScheduleModal } from "../";
import type { Schedule } from "../../types";

interface SwipeableWrapperProps {
  children: ReactNode;
  schedule: Schedule;
  tripId: string;
}

const ACTION_BUTTON_WIDTH = 60;
const SWIPE_THRESHOLD = 50;

export default function SwipeableWrapper({
  children,
  schedule,
  tripId,
}: SwipeableWrapperProps) {
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
          backgroundColor: "white",
          zIndex: 1,
          cursor: "grab",
        }}
      >
        <Box w="full">{children}</Box>
      </motion.div>

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
