import { Box, VStack, Text } from "@chakra-ui/react";

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

export default function FloatingMenuList({
  items,
  isOpen,
  onClose,
  onItemClick,
}: FloatingMenuListProps) {
  if (!isOpen) return null;

  return (
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

      <VStack
        position="fixed"
        bottom="80px"
        right={6}
        zIndex={999}
        align="stretch"
      >
        {items.map((item, index) => (
          <Box
            key={index}
            as="button"
            bg="white"
            px={4}
            py={3}
            borderRadius="lg"
            shadow="lg"
            minW="200px"
            textAlign="left"
            transition="all 0.2s"
            _active={{
              transform: "translateY(0)",
            }}
            onClick={() => onItemClick(item.onClick)}
          >
            <Text fontSize="md" fontWeight="medium" color="gray.700">
              {item.label}
            </Text>
          </Box>
        ))}
      </VStack>
    </>
  );
}
