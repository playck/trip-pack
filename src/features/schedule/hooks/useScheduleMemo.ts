import { useState } from "react";
import { useCreateMemo } from "../services/useCreateMemo";

interface SelectedDay {
  dayNumber: number;
  date: string;
}

export const useScheduleMemo = (tripId: string) => {
  const [isMemoSheetOpen, setIsMemoSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const createMemoMutation = useCreateMemo(tripId);

  const handleAddMemo = (dayNumber: number, date: string) => {
    setSelectedDay({ dayNumber, date });
    setIsMemoSheetOpen(true);
  };

  const handleCloseMemoSheet = () => {
    setIsMemoSheetOpen(false);
  };

  const handleSaveMemo = (memoText: string) => {
    if (!tripId || !selectedDay) {
      return;
    }

    createMemoMutation.mutate({
      tripId,
      dayNumber: selectedDay.dayNumber,
      scheduleDate: selectedDay.date,
      memoText,
    });
  };

  return {
    isMemoSheetOpen,
    selectedDay,
    handleAddMemo,
    handleCloseMemoSheet,
    handleSaveMemo,
  };
};
