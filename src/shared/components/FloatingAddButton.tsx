import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import FloatingMenuList, { type FloatingMenuItem } from "./FloatingMenuList";
export type { FloatingMenuItem };

interface FloatingAddButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
  menuItems?: FloatingMenuItem[];
  bottomOffset?: number | string;
}

export default function FloatingAddButton({
  onClick,
  ariaLabel = "새 항목 추가",
  menuItems,
  bottomOffset = 22,
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

      <IconButton
        aria-label={ariaLabel}
        position="fixed"
        bottom={bottomOffset}
        right={6}
        size="lg"
        borderRadius="full"
        colorPalette={colors.primary.palette}
        variant="solid"
        shadow="lg"
        onClick={handleClick}
        zIndex={999}
        transform={isMenuOpen ? "rotate(45deg)" : "rotate(0deg)"}
        transition="transform 0.2s"
      >
        {isMenuOpen ? <X color="white" /> : <Plus color="white" />}
      </IconButton>
    </>
  );
}
