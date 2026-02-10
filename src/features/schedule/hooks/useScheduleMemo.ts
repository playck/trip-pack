import { useState } from "react";
import { useCreateMemo } from "../services/useCreateMemo";
import { useUpdateSchedule } from "../services/useUpdateSchedule";
import type { SelectedDay } from "../types";

interface EditingMemo {
  scheduleId: string;
  memoText: string;
}

export const useScheduleMemo = (tripId: string) => {
  const [isMemoSheetOpen, setIsMemoSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  const [editingMemo, setEditingMemo] = useState<EditingMemo | null>(null);

  const createMemoMutation = useCreateMemo(tripId);
  const updateScheduleMutation = useUpdateSchedule(tripId);

  const handleAddMemo = (dayNumber: number, date: string) => {
    setSelectedDay({ dayNumber, date });
    setEditingMemo(null);
    setIsMemoSheetOpen(true);
  };

  const handleEditMemo = (
    scheduleId: string,
    memoText: string,
    dayNumber: number,
    date: string
  ) => {
    setSelectedDay({ dayNumber, date });
    setEditingMemo({ scheduleId, memoText });
    setIsMemoSheetOpen(true);
  };

  const handleCloseMemoSheet = () => {
    setIsMemoSheetOpen(false);
    setEditingMemo(null);
  };

  const handleSaveMemo = (memoText: string) => {
    if (!tripId || !selectedDay) {
      return;
    }

    if (editingMemo) {
      // 수정 모드
      updateScheduleMutation.mutate({
        scheduleId: editingMemo.scheduleId,
        placeName: memoText,
      });
    } else {
      // 추가 모드
      createMemoMutation.mutate({
        tripId,
        dayNumber: selectedDay.dayNumber,
        scheduleDate: selectedDay.date,
        memoText,
      });
    }
  };

  return {
    isMemoSheetOpen,
    selectedDay,
    editingMemo,
    handleAddMemo,
    handleEditMemo,
    handleCloseMemoSheet,
    handleSaveMemo,
  };
};
