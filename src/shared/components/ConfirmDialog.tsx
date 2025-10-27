import { Text } from "@chakra-ui/react";
import { Modal } from "@/shared/components";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  isLoading = false,
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      actions={[
        {
          label: cancelLabel,
          onClick: onClose,
          variant: "outline",
          colorPalette: "gray",
          disabled: isLoading,
        },
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: "solid",
          colorPalette: isDangerous ? "red" : "teal",
          isLoading,
        },
      ]}
    >
      {typeof message === "string" ? <Text>{message}</Text> : message}
    </Modal>
  );
}
