import { useState } from "react";
import { IconButton, VStack } from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import FloatingMenuList, { type FloatingMenuItem } from "./FloatingMenuList";
export type { FloatingMenuItem };

interface FloatingAddButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
  menuItems?: FloatingMenuItem[];
  bottomOffset?: number | string;
  topSlot?: React.ReactNode;
}

export default function FloatingAddButton({
  onClick,
  ariaLabel = "새 항목 추가",
  menuItems,
  bottomOffset = 22,
  topSlot,
}: FloatingAddButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = () => {
    if (menuItems && menuItems.length > 0) {
      setIsMenuOpen(!isMenuOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleMenuItemClick = (itemOnClick: () => void) => {
    itemOnClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      <FloatingMenuList
        items={menuItems || []}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onItemClick={handleMenuItemClick}
      />

      <VStack
        position="fixed"
        bottom={bottomOffset}
        right={6}
        zIndex={999}
        gap={3}
        align="center"
      >
        {topSlot}

        <IconButton
          aria-label={ariaLabel}
          size="lg"
          borderRadius="full"
          colorPalette={colors.primary.palette}
          variant="solid"
          shadow="lg"
          onClick={handleClick}
          transform={isMenuOpen ? "rotate(45deg)" : "rotate(0deg)"}
          transition="transform 0.2s"
        >
          {isMenuOpen ? <X color="white" /> : <Plus color="white" />}
        </IconButton>
      </VStack>
    </>
  );
}
