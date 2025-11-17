import { useState, useRef } from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useDeleteExpense } from "../hooks/useDeleteExpense";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface SwipeableExpenseItemProps {
  expense: ExpenseItem;
  tripId: string;
  showBorder?: boolean;
}

const ACTION_BUTTON_WIDTH = 42;
const SWIPE_THRESHOLD = 35;

export default function SwipeableExpenseItem({
  expense,
  tripId,
  showBorder = false,
}: SwipeableExpenseItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dragConstraintsRef = useRef(null);

  const deleteExpenseMutation = useDeleteExpense({
    tripId,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setIsOpen(false);
    },
  });

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // 왼쪽으로 threshold 이상 스와이프 → 열기
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setIsOpen(true);
    }
    // 오른쪽으로 threshold 이상 스와이프 → 닫기
    else if (info.offset.x > SWIPE_THRESHOLD) {
      setIsOpen(false);
    }
    // threshold 미만 스와이프 → 원래 상태로 되돌림
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteExpenseMutation.mutate(expense.id);
  };

  return (
    <>
      <Box position="relative" overflow="hidden" ref={dragConstraintsRef}>
        <Box
          position="absolute"
          right="4px"
          top="50%"
          transform="translateY(-50%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          zIndex={0}
          onClick={handleDeleteClick}
          color="red.500"
        >
          <Trash2 size={18} />
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
          <Flex
            justify="space-between"
            align="center"
            py={2}
            borderBottom={showBorder ? "1px solid" : undefined}
            borderColor="gray.100"
          >
            <Text fontSize="15px" color="gray.700">
              {expense.name}
            </Text>
            <HStack gap={0.5} align="baseline">
              <Text fontSize="md" fontWeight="semibold" color="gray.900">
                {expense.amount.toLocaleString()}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.900">
                원
              </Text>
            </HStack>
          </Flex>
        </motion.div>
      </Box>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="경비 삭제"
        message={
          <Text>
            <Text as="span" fontWeight="bold">
              "{expense.name}"
            </Text>{" "}
            경비를 삭제하시겠습니까?
            <br />
            <Text as="span" color="red.600" fontWeight="medium">
              삭제된 경비는 복구할 수 없습니다.
            </Text>
          </Text>
        }
        confirmLabel="삭제하기"
        cancelLabel="취소"
        onConfirm={handleDeleteConfirm}
        isLoading={deleteExpenseMutation.isPending}
        isDangerous
      />
    </>
  );
}
