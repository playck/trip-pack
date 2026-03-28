import { useMemo } from "react";
import { Box, VStack, HStack, Text, Separator } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { hexColors } from "@/shared/constants/colors";

type GroupedEntry =
  | { type: "single"; item: FloatingMenuItem; index: number }
  | { type: "group"; groupLabel: string; items: FloatingMenuItem[]; index: number };

export interface FloatingMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  group?: string;
  groupLabel?: string;
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
  const grouped = useMemo(() => {
    const result: GroupedEntry[] = [];
    let i = 0;
    while (i < items.length) {
      const item = items[i];
      if (item.group) {
        const groupItems: FloatingMenuItem[] = [];
        const groupLabel = item.groupLabel ?? item.group;
        while (i < items.length && items[i].group === item.group) {
          groupItems.push(items[i]);
          i++;
        }
        result.push({ type: "group", groupLabel, items: groupItems, index: result.length });
      } else {
        result.push({ type: "single", item, index: result.length });
        i++;
      }
    }
    return result;
  }, [items]);

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
              {grouped.map((entry) => (
                <Box key={entry.index}>
                  {entry.index > 0 && <Separator borderColor="gray.200" />}
                  {entry.type === "single" ? (
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
                      onClick={() => onItemClick(entry.item.onClick)}
                    >
                      {entry.item.icon && (
                        <Box color={hexColors.teal[500]} flexShrink={0}>
                          {entry.item.icon}
                        </Box>
                      )}
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                        textAlign="left"
                      >
                        {entry.item.label}
                      </Text>
                    </HStack>
                  ) : (
                    <Box px={4} py={3}>
                      <Text fontSize="xs" color="gray.500" mb={2}>
                        {entry.groupLabel}
                      </Text>
                      <HStack gap={3} justify="center">
                        {entry.items.map((item, i) => (
                          <VStack
                            key={i}
                            as="button"
                            gap={1}
                            px={3}
                            py={2}
                            borderRadius="lg"
                            cursor="pointer"
                            transition="background 0.15s"
                            _hover={{ bg: "gray.50" }}
                            _active={{ bg: "gray.100" }}
                            onClick={() => onItemClick(item.onClick)}
                          >
                            {item.icon && (
                              <Box color={hexColors.teal[500]}>
                                {item.icon}
                              </Box>
                            )}
                            <Text fontSize="xs" color="gray.600" fontWeight="medium">
                              {item.label}
                            </Text>
                          </VStack>
                        ))}
                      </HStack>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          </MotionBox>
        </>
      )}
    </AnimatePresence>
  );
}
