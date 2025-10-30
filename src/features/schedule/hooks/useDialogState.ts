import { useState } from "react";

export type DialogType = "back" | "delete" | "moveDate" | null;

/**
 * 다이얼로그/시트 상태 관리 훅
 */
export function useDialogState() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const openBackDialog = () => setOpenDialog("back");
  const openDeleteDialog = () => setOpenDialog("delete");
  const openMoveDateSheet = () => setOpenDialog("moveDate");
  const closeDialog = () => setOpenDialog(null);

  return {
    openDialog,
    openBackDialog,
    openDeleteDialog,
    openMoveDateSheet,
    closeDialog,
  };
}
