import React from "react";
import { Drawer, Portal, IconButton, Text } from "@chakra-ui/react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
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
