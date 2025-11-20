import { useState, useRef } from "react";
import { Box, Flex, Text, HStack } from "@chakra-ui/react";
import { motion, type PanInfo } from "framer-motion";
import { Trash2, Edit3 } from "lucide-react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useDeleteExpense } from "../hooks/useDeleteExpense";
import { useUpdateExpense } from "../hooks/useUpdateExpense";
import EditExpenseSheet from "./EditExpenseSheet";

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

const ACTION_BUTTON_WIDTH = 70;
const SWIPE_THRESHOLD = 50;

export default function SwipeableExpenseItem({
  expense,
  tripId,
  showBorder = false,
}: SwipeableExpenseItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dragConstraintsRef = useRef(null);

  const updateExpenseMutation = useUpdateExpense({
    tripId,
    onSuccess: () => {
      setIsEditSheetOpen(false);
      setIsOpen(false);
    },
  });

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
  };

  const handleEditClick = () => {
    setIsEditSheetOpen(true);
  };

  const handleEditSave = (name: string, amount: number) => {
    updateExpenseMutation.mutate({
      expenseId: expense.id,
      category: name,
      amount,
    });
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
        {/* 액션 버튼(수정, 삭제) */}
        <HStack
          position="absolute"
          right="4px"
          top="50%"
          transform="translateY(-50%)"
          gap={4}
          zIndex={0}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={handleEditClick}
            color="blue.500"
          >
            <Edit3 size={18} />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={handleDeleteClick}
            color="red.500"
          >
            <Trash2 size={18} />
          </Box>
        </HStack>

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

      <EditExpenseSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        onSaveExpense={handleEditSave}
        initialName={expense.name}
        initialAmount={expense.amount}
      />

      {/* 삭제 확인 다이얼로그 */}
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
