import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useDeleteSchedule } from "../services/useDeleteSchedule";
import { useUpdateSchedule } from "../services/useUpdateSchedule";
import { useCreateExpense } from "@/features/expense/services/useCreateExpense";
import type { ExpenseSaveOptions } from "@/features/expense/components/AddExpenseSheet";
import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";

interface EditMemoHandler {
  (
    scheduleId: string,
    memoText: string,
    dayNumber: number,
    scheduleDate: string,
    iconKey?: string
  ): void;
}

/**
 * 일정 상세 액션 관리 훅
 * - 액션 시트 (수정/삭제/경비추가)
 * - 일정 수정 시트
 * - 삭제 확인 다이얼로그
 * - 경비 추가 시트
 */
export function useScheduleDetailActions(
  tripId: string,
  onEditMemo: EditMemoHandler
) {
  // 액션 시트
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  // 수정 시트
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // 삭제 확인
  const {
    open: isDeleteConfirmOpen,
    onOpen: openDeleteConfirm,
    onClose: closeDeleteConfirm,
  } = useDisclosure();

  // 경비 추가 시트
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);
  const [selectedScheduleForExpense, setSelectedScheduleForExpense] =
    useState<Schedule | null>(null);

  // Mutations
  const deleteScheduleMutation = useDeleteSchedule(tripId, {
    onSuccess: () => {
      closeDeleteConfirm();
      setSelectedSchedule(null);
    },
  });

  const updateScheduleMutation = useUpdateSchedule(tripId);

  const createExpenseMutation = useCreateExpense(tripId, {
    onSuccess: () => {
      setIsExpenseSheetOpen(false);
      setSelectedScheduleForExpense(null);
    },
  });

  // 액션 시트 핸들러
  const handleOpenActionSheet = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsActionSheetOpen(true);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetOpen(false);
  };

  // 수정 핸들러
  const handleEditSchedule = () => {
    if (!selectedSchedule) return;

    if (isMemo(selectedSchedule)) {
      onEditMemo(
        selectedSchedule.id,
        selectedSchedule.place_name,
        selectedSchedule.day_number,
        selectedSchedule.schedule_date,
        selectedSchedule.category ?? undefined
      );
      setSelectedSchedule(null);
    } else {
      setIsEditSheetOpen(true);
    }
  };

  const handleCloseEditSheet = () => {
    setIsEditSheetOpen(false);
    setSelectedSchedule(null);
  };

  const handleSaveEditSchedule = (
    scheduleId: string,
    updates: { placeName: string; notes?: string; category?: string }
  ) => {
    updateScheduleMutation.mutate({ scheduleId, ...updates });
  };

  // 삭제 핸들러
  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      openDeleteConfirm();
    }
  };

  const handleConfirmDelete = () => {
    if (selectedSchedule) {
      deleteScheduleMutation.mutate(selectedSchedule.id);
    }
  };

  // 경비 추가 핸들러
  const handleOpenExpenseSheet = () => {
    if (selectedSchedule) {
      setSelectedScheduleForExpense(selectedSchedule);
      setIsExpenseSheetOpen(true);
    }
  };

  const handleCloseExpenseSheet = () => {
    setIsExpenseSheetOpen(false);
    setSelectedScheduleForExpense(null);
  };

  const handleSaveExpense = (
    name: string,
    amount: number,
    scheduleId?: string,
    options?: ExpenseSaveOptions
  ) => {
    if (!tripId || !selectedScheduleForExpense) return;

    createExpenseMutation.mutate({
      tripId,
      expenseDate: dayjs(selectedScheduleForExpense.schedule_date).format(
        "YYYY-MM-DD"
      ),
      dayNumber: selectedScheduleForExpense.day_number,
      category: name,
      amount,
      memo: options?.memo,
      scheduleId,
      isPersonal: options?.isPersonal,
    });
  };

  return {
    // 액션 시트
    isActionSheetOpen,
    selectedSchedule,
    handleOpenActionSheet,
    handleCloseActionSheet,
    // 수정
    isEditSheetOpen,
    handleEditSchedule,
    handleCloseEditSheet,
    handleSaveEditSchedule,
    // 삭제
    isDeleteConfirmOpen,
    closeDeleteConfirm,
    handleDeleteSchedule,
    handleConfirmDelete,
    isDeleting: deleteScheduleMutation.isPending,
    // 경비
    isExpenseSheetOpen,
    selectedScheduleForExpense,
    handleOpenExpenseSheet,
    handleCloseExpenseSheet,
    handleSaveExpense,
  };
}
