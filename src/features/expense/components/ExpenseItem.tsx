import { useState } from "react";
import { Box, Flex, Text, HStack, IconButton } from "@chakra-ui/react";
import { MoreVertical, Link2 } from "lucide-react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { useDeleteExpense, useUpdateExpense } from "../services";
import EditExpenseSheet from "./EditExpenseSheet";
import ExpenseActionSheet from "./ExpenseActionSheet";
import type { ExpenseItemData } from "../types";
import type { ExpenseSaveOptions } from "./AddExpenseSheet";
import { formatAmount } from "../utils/helper";

interface ExchangeInfo {
  showLocalCurrency: boolean;
  exchangeRate: number;
  currencySymbol: string;
  isForeignCurrency: boolean;
}

interface ExpenseItemProps {
  expense: ExpenseItemData;
  tripId: string;
  showBorder?: boolean;
  exchangeInfo?: ExchangeInfo;
  selectedDate?: string;
  readOnly?: boolean;
  totalMemberCount?: number;
}

export default function ExpenseItem({
  expense,
  tripId,
  showBorder = false,
  exchangeInfo,
  selectedDate,
  readOnly = false,
  totalMemberCount = 0,
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
    scheduleId?: string | null,
    options?: ExpenseSaveOptions,
  ) => {
    updateExpenseMutation.mutate({
      expenseId: expense.id,
      category: name,
      amount,
      memo: options?.memo,
      scheduleId,
      isShared: options?.isShared,
      paidBy: options?.paidBy,
      splitMemberIds: options?.splitMemberIds,
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

  // 개인 경비 표시: 멤버 2명 이상이고 공유가 아닌 경우
  const showPersonalBadge = totalMemberCount >= 2 && !expense.isShared;

  const displayName = expense.memo?.trim() || expense.name;

  return (
    <>
      <Box
        position="relative"
        py={2}
        borderBottom={showBorder ? "1px solid" : undefined}
        borderColor="gray.100"
      >
        <Flex justify="space-between" align="center" pr={readOnly ? 0 : 8}>
          <Box flex={1} minW={0}>
            <HStack gap={1} align="center">
              <Text fontSize="15px" color="gray.700">
                {displayName}
              </Text>
              {showPersonalBadge && (
                <Text
                  fontSize="2xs"
                  color="purple.500"
                  fontWeight="bold"
                  lineHeight={1}
                  px={1}
                  py={0.5}
                  bg="purple.50"
                  borderRadius="sm"
                >
                  MY
                </Text>
              )}
            </HStack>
            {expense.scheduleName && (
              <HStack gap={1} mt={0.5}>
                <Link2 size={11} color="var(--chakra-colors-gray-400)" />
                <Text fontSize="xs" color="gray.400" lineClamp={1}>
                  {expense.scheduleName}
                </Text>
              </HStack>
            )}
          </Box>
          <HStack gap={0.5} align="baseline" flexShrink={0}>
            <Text fontSize="md" fontWeight="semibold" color="gray.900">
              {amountUnit !== "원" && amountUnit}
              {amountValue}
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray.900">
              {amountUnit === "원" ? "원" : ""}
            </Text>
          </HStack>
        </Flex>

        {!readOnly && (
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
        )}
      </Box>

      {!readOnly && (
        <>
          <ExpenseActionSheet
            isOpen={isActionSheetOpen}
            onClose={() => setIsActionSheetOpen(false)}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            expenseName={displayName}
          />

          <EditExpenseSheet
            isOpen={isEditSheetOpen}
            onClose={() => setIsEditSheetOpen(false)}
            onSaveExpense={handleEditSave}
            initialName={expense.name}
            initialAmount={expense.amount}
            initialMemo={expense.memo}
            initialScheduleId={expense.scheduleId}
            initialIsShared={expense.isShared}
            initialPaidByUserId={expense.paidByUserId}
            initialSplitMemberIds={expense.splitMemberIds}
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
                  "{displayName}"
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
      )}
    </>
  );
}
