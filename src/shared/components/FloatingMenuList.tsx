import { Box, VStack, HStack, Text, Separator } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { hexColors } from "@/shared/constants/colors";

export interface FloatingMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface FloatingMenuListProps {
  items: FloatingMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (onClick: () => void) => void;
}

const MotionBox = motion.create(Box);

export default function FloatingMenuList({
  items,
  isOpen,
  onClose,
  onItemClick,
}: FloatingMenuListProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.300"
            zIndex={998}
            onClick={onClose}
          />

          <MotionBox
            position="fixed"
            bottom="80px"
            right={6}
            zIndex={999}
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{ originX: 1, originY: 1 }}
          >
            <VStack
              bg="white"
              borderRadius="xl"
              shadow="xl"
              overflow="hidden"
              minW="200px"
              gap={0}
              align="stretch"
            >
              {items.map((item, index) => (
                <Box key={index}>
                  {index > 0 && <Separator borderColor="gray.200" />}
                  <HStack
                    as="button"
                    w="full"
                    px={4}
                    py={3.5}
                    gap={3}
                    cursor="pointer"
                    transition="background 0.15s"
                    _hover={{ bg: "gray.50" }}
                    _active={{ bg: "gray.100" }}
                    onClick={() => onItemClick(item.onClick)}
                  >
                    {item.icon && (
                      <Box color={hexColors.teal[500]} flexShrink={0}>
                        {item.icon}
                      </Box>
                    )}
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                      textAlign="left"
                    >
                      {item.label}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
}
