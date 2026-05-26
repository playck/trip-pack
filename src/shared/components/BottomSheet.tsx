import React, { useEffect, useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import {
  Drawer,
  Portal,
  IconButton,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useKeyboardOffset } from "@/shared/hooks";
import { colors } from "@/shared/constants/colors";
import {
  BOTTOM_SHEET_MAX_HEIGHT,
  BOTTOM_SHEET_MIN_HEIGHT,
} from "@/shared/constants/bottomSheet";
import { pushSheet, popSheet, useTopSheetId } from "./bottomSheetStack";

interface BottomSheetAction {
  text?: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export type BottomSheetSize = "content" | "min" | "max" | "fullscreen";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  size?: BottomSheetSize;
  adjustForKeyboard?: boolean;
  closeOnInteractOutside?: boolean;
  primaryButton?: BottomSheetAction;
  secondaryButton?: BottomSheetAction;
}

export default function BottomSheet({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  size = "content",
  adjustForKeyboard = true,
  closeOnInteractOutside = true,
  primaryButton,
  secondaryButton,
}: BottomSheetProps) {
  const isFullscreen = size === "fullscreen";
  const { minHeight, maxHeight } =
    size === "min"
      ? {
          minHeight: BOTTOM_SHEET_MIN_HEIGHT,
          maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
        }
      : size === "max"
        ? {
            minHeight: BOTTOM_SHEET_MAX_HEIGHT,
            maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
          }
        : isFullscreen
          ? { minHeight: "100dvh", maxHeight: "100dvh" }
          : { minHeight: undefined, maxHeight: BOTTOM_SHEET_MAX_HEIGHT };

  const keyboardOffset = useKeyboardOffset(
    isOpen && adjustForKeyboard && !isFullscreen,
  );

  // 키보드가 떠있는 동안에는 시트 높이가 가시 영역(viewport - 키보드)을 넘지 않도록 min/max 모두 캡
  const visibleAreaCap =
    keyboardOffset > 0 ? `calc(100vh - ${keyboardOffset}px)` : undefined;
  const effectiveMaxHeight = visibleAreaCap ?? maxHeight;
  const effectiveMinHeight =
    visibleAreaCap && minHeight ? visibleAreaCap : minHeight;

  // 글로벌 stack 에 본인을 등록. 최상단이 아니면 시각적으로 숨김.
  const [myId, setMyId] = useState<number | null>(null);
  const topId = useTopSheetId();
  useEffect(() => {
    if (!isOpen) return;
    const id = pushSheet();
    setMyId(id);
    return () => {
      popSheet(id);
      setMyId(null);
    };
  }, [isOpen]);
  const isHidden = myId !== null && topId !== null && myId !== topId;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="bottom"
      closeOnInteractOutside={closeOnInteractOutside}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Drawer.Backdrop bg="blackAlpha.600" />
        <Drawer.Positioner>
          <Drawer.Content
            borderTopRadius={
              isFullscreen || (keyboardOffset > 0 && size !== "content")
                ? "none"
                : "xl"
            }
            borderBottomRadius="none"
            minHeight={effectiveMinHeight}
            maxHeight={effectiveMaxHeight}
            overflowY={isFullscreen ? "hidden" : "auto"}
            overscrollBehavior="contain"
            style={{
              opacity: isHidden ? 0.7 : 1,
              pointerEvents: isHidden ? "none" : "auto",
              transform:
                keyboardOffset > 0
                  ? `translateY(-${keyboardOffset}px)`
                  : undefined,
              transition: "opacity 0.15s ease-out, transform 0.1s ease-out",
            }}
          >
            <Drawer.Header
              px={4}
              pt={5}
              pb={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              {onBack && (
                <IconButton
                  variant="ghost"
                  h="35px"
                  position="absolute"
                  left={4}
                  onClick={onBack}
                >
                  <ChevronLeft size={20} />
                </IconButton>
              )}
              <Text fontSize="lg" fontWeight="semibold">
                {title}
              </Text>
              <Drawer.CloseTrigger asChild>
                <IconButton
                  variant="ghost"
                  h="35px"
                  position="absolute"
                  right={4}
                  onClick={onClose}
                  _focus={{ outline: "none", boxShadow: "none" }}
                  _focusVisible={{ outline: "none", boxShadow: "none" }}
                >
                  <X size={20} />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body
              p={0}
              display="flex"
              flexDirection="column"
              {...(isFullscreen ? { flex: 1, minH: 0, overflowY: "auto" } : {})}
            >
              {children}
            </Drawer.Body>
            {(primaryButton || secondaryButton) && (
              <Drawer.Footer
                p={3.5}
                pb="calc(14px + env(safe-area-inset-bottom))"
                bg="white"
              >
                <HStack gap={3} w="full">
                  {secondaryButton && (
                    <Button
                      variant="surface"
                      flex={1}
                      size="lg"
                      borderRadius="xl"
                      colorPalette="gray"
                      color="gray.700"
                      onClick={secondaryButton.onClick}
                      disabled={
                        secondaryButton.disabled || secondaryButton.isLoading
                      }
                    >
                      {secondaryButton.text || "취소"}
                    </Button>
                  )}
                  {primaryButton && (
                    <Button
                      variant="solid"
                      flex={1}
                      size="lg"
                      borderRadius="xl"
                      colorPalette={colors.primary.palette}
                      onClick={primaryButton.onClick}
                      loading={primaryButton.isLoading}
                      disabled={primaryButton.disabled}
                    >
                      {primaryButton.text || "저장"}
                    </Button>
                  )}
                </HStack>
              </Drawer.Footer>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
