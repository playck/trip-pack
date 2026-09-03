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

import { useCloseOnNativeTabFocus } from "@/shared/hooks";
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
  /**
   * 네이티브 앱에서 탭을 전환했다가 돌아왔을 때 이 모달을 유지할지 여부 (기본 false).
   * 기본값은 닫힘 — 탭을 옮겼다 돌아오면 이전 모달이 남아있지 않게 한다.
   */
  keepOnTabFocus?: boolean;
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
  keepOnTabFocus = false,
}: ModalProps) {
  // 네이티브 탭 재진입 시 닫기 (keepOnTabFocus면 유지)
  useCloseOnNativeTabFocus(isOpen, onClose, !keepOnTabFocus);

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
      placement="center"
      closeOnInteractOutside={closeOnOverlayClick}
      closeOnEscape={closeOnEsc}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        {/* placement="center"가 안전 중앙정렬(margin:auto)을 제공 —
            콘텐츠가 뷰포트보다 커져도 상단이 잘리지 않고 스크롤 가능 */}
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="xl"
            width={{ base: "90vw", sm: "100%" }}
            mx="auto"
            overscrollBehavior="contain"
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
                    {/* 닫기는 CloseTrigger→onOpenChange 경로가 처리 — onClick 중복 호출 금지 */}
                    <IconButton
                      aria-label="모달 닫기"
                      variant="ghost"
                      size="md"
                      color="gray.500"
                      _focus={{ outline: "none", boxShadow: "none" }}
                      _focusVisible={{ outline: "none", boxShadow: "none" }}
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
