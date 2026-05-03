import React from "react";
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
  BOTTOM_SHEET_HEIGHT,
  BOTTOM_SHEET_MIN_HEIGHT,
} from "@/shared/constants/bottomSheet";

interface BottomSheetAction {
  text?: string;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title?: string;
  children: React.ReactNode;
  expanded?: boolean;
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
  expanded = false,
  adjustForKeyboard = true,
  closeOnInteractOutside = true,
  primaryButton,
  secondaryButton,
}: BottomSheetProps) {
  const minHeight = expanded ? BOTTOM_SHEET_HEIGHT : BOTTOM_SHEET_MIN_HEIGHT;
  const keyboardOffset = useKeyboardOffset(isOpen && adjustForKeyboard);

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
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            borderTopRadius="xl"
            borderBottomRadius="none"
            minHeight={minHeight}
            maxHeight={BOTTOM_SHEET_HEIGHT}
            overscrollBehavior="contain"
            style={{
              transform:
                keyboardOffset > 0
                  ? `translateY(-${keyboardOffset}px)`
                  : undefined,
              transition: "transform 0.1s ease-out",
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
            <Drawer.Body p={0} display="flex" flexDirection="column">
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
