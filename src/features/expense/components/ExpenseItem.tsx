import { useState } from "react";
import { Box, Flex, Text, HStack, IconButton } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useDeleteExpense, useUpdateExpense } from "../services";
import EditExpenseSheet from "./EditExpenseSheet";
import ExpenseActionSheet from "./ExpenseActionSheet";
import { formatAmount } from "../utils/helper";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  scheduleId?: string | null;
}

interface ExchangeInfo {
  showLocalCurrency: boolean;
  exchangeRate: number;
  currencySymbol: string;
  isForeignCurrency: boolean;
}

interface ExpenseItemProps {
  expense: ExpenseItem;
  tripId: string;
  showBorder?: boolean;
  exchangeInfo?: ExchangeInfo;
  selectedDate?: string;
}

export default function ExpenseItem({
  expense,
  tripId,
  showBorder = false,
  exchangeInfo,
  selectedDate,
}: ExpenseItemProps) {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateExpenseMutation = useUpdateExpense({
    tripId,
    onSuccess: () => {
      setIsEditSheetOpen(false);
      setIsActionSheetOpen(false);
    },
  });

  const deleteExpenseMutation = useDeleteExpense({
    tripId,
    onSuccess: () => {
      setIsDeleteModalOpen(false);
      setIsActionSheetOpen(false);
    },
  });

  const handleEditClick = () => {
    setIsEditSheetOpen(true);
  };

  const handleEditSave = (
    name: string,
    amount: number,
    scheduleId?: string | null
  ) => {
    updateExpenseMutation.mutate({
      expenseId: expense.id,
      category: name,
      amount,
      scheduleId,
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteExpenseMutation.mutate(expense.id);
  };

  const { value: amountValue, unit: amountUnit } = exchangeInfo
    ? formatAmount(expense.amount, {
        showLocalCurrency: exchangeInfo.showLocalCurrency,
        isForeignCurrency: exchangeInfo.isForeignCurrency,
        exchangeRate: exchangeInfo.exchangeRate,
        targetCurrency: "",
        currencySymbol: exchangeInfo.currencySymbol,
      })
    : {
        value: expense.amount.toLocaleString(),
        unit: "원",
      };

  return (
    <>
      <Box
        position="relative"
        py={2}
        borderBottom={showBorder ? "1px solid" : undefined}
        borderColor="gray.100"
      >
        <Flex justify="space-between" align="center" pr={8}>
          <Text fontSize="15px" color="gray.700">
            {expense.name}
          </Text>
          <HStack gap={0.5} align="baseline">
            <Text fontSize="md" fontWeight="semibold" color="gray.900">
              {amountUnit !== "원" && amountUnit}
              {amountValue}
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
              {amountUnit === "원" ? "원" : ""}
            </Text>
          </HStack>
        </Flex>

        <IconButton
          aria-label="경비 관리"
          variant="ghost"
          size="xs"
          color="gray.400"
          position="absolute"
          right={0}
          top="50%"
          transform="translateY(-50%)"
          onClick={() => setIsActionSheetOpen(true)}
        >
          <MoreVertical size={16} />
        </IconButton>
      </Box>

      <ExpenseActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        expenseName={expense.name}
      />

      <EditExpenseSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        onSaveExpense={handleEditSave}
        initialName={expense.name}
        initialAmount={expense.amount}
        initialScheduleId={expense.scheduleId}
        tripId={tripId}
        selectedDate={selectedDate}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="경비 삭제"
        children={
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
