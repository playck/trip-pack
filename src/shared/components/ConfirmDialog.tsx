import { Text } from "@chakra-ui/react";
import { Modal } from "@/shared/components";
import type { ReactNode } from "react";
import { colors, statusColors } from "@/shared/constants/colors";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
  showCancel?: boolean;
  confirmDisabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  isLoading = false,
  isDangerous = false,
  showCancel = true,
  confirmDisabled = false,
  size = "sm",
}: ConfirmDialogProps) {
  const actions = [];

  if (showCancel) {
    actions.push({
      label: cancelLabel,
      onClick: onClose,
      variant: "surface" as const,
      colorPalette: "gray",
      disabled: isLoading,
    });
  }

  actions.push({
    label: confirmLabel,
    onClick: onConfirm,
    variant: "solid" as const,
    colorPalette: isDangerous
      ? statusColors.error.palette
      : colors.primary.palette,
    isLoading,
    disabled: confirmDisabled || isLoading,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      actions={actions}
    >
      {message ? <Text>{message}</Text> : children}
    </Modal>
  );
}
