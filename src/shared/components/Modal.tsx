import {
  Dialog,
  Portal,
  Button,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

import { colors } from "@/shared/constants/colors";

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "solid" | "outline" | "ghost" | "surface";
  colorPalette?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";
  actions?: ModalAction[];
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  actions,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose();
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={size}
      closeOnInteractOutside={closeOnOverlayClick}
      closeOnEscape={closeOnEsc}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
        >
          <Dialog.Content
            borderRadius="xl"
            maxW={{ base: "90vw", sm: "auto" }}
            mx={4}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <Dialog.Header
                px={6}
                pt={4}
                pb={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {title && (
                  <Dialog.Title>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.900"
                      textAlign="center"
                    >
                      {title}
                    </Text>
                  </Dialog.Title>
                )}
                {!hideCloseButton && (
                  <Dialog.CloseTrigger asChild>
                    <IconButton
                      aria-label="모달 닫기"
                      variant="ghost"
                      size="md"
                      color="gray.500"
                      onClick={onClose}
                    >
                      <X size={24} />
                    </IconButton>
                  </Dialog.CloseTrigger>
                )}
              </Dialog.Header>
            )}

            {/* Body */}
            <Dialog.Body px={6} py={title ? 1 : 4}>
              {children}
            </Dialog.Body>

            {/* Footer */}
            {actions && actions.length > 0 && (
              <Dialog.Footer px={6} pb={4} pt={2}>
                <HStack gap={3} w="full">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      colorPalette={
                        action.colorPalette === "neutral"
                          ? "gray"
                          : action.colorPalette || colors.primary.palette
                      }
                      size="md"
                      loading={action.isLoading}
                      disabled={action.disabled}
                      onClick={action.onClick}
                      borderRadius="lg"
                      flex={1}
                    >
                      {action.label}
                    </Button>
                  ))}
                </HStack>
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
