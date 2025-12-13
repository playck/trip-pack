import React from "react";
import { X } from "lucide-react";
import { Drawer, Portal, IconButton, Text } from "@chakra-ui/react";
import { useKeyboardOffset } from "@/shared/hooks";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  minHeight?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  minHeight,
}: BottomSheetProps) {
  const keyboardOffset = useKeyboardOffset(isOpen);

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="bottom"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            borderTopRadius="xl"
            borderBottomRadius="none"
            pb="env(safe-area-inset-bottom)"
            minHeight={minHeight}
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
                >
                  <X size={20} />
                </IconButton>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body p={0}>{children}</Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
