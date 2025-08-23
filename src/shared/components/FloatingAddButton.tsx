import { IconButton } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { colors } from "@/shared/constants/colors";

interface FloatingAddButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

export default function FloatingAddButton({
  onClick,
  ariaLabel = "새 항목 추가",
}: FloatingAddButtonProps) {
  return (
    <IconButton
      aria-label={ariaLabel}
      position="fixed"
      bottom={6}
      right={6}
      size="lg"
      borderRadius="full"
      colorPalette={colors.primary.palette}
      variant="solid"
      shadow="lg"
      onClick={onClick}
    >
      <Plus color="white" />
    </IconButton>
  );
}
