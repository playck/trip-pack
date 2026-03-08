import { Button } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

type ButtonVariant = "digit" | "operator" | "action" | "equal";

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  isActive?: boolean;
  gridColumn?: string;
  gridRow?: string;
}

const variantStyles: Record<
  ButtonVariant,
  { bg: string; color: string; activeBg?: string; activeColor?: string }
> = {
  digit: { bg: "gray.100", color: "gray.800" },
  operator: {
    bg: "orange.400",
    color: "white",
    activeBg: "orange.600",
    activeColor: "white",
  },
  action: { bg: "gray.200", color: "gray.600" },
  equal: { bg: colors.primary.palette, color: "white" },
};

export default function CalculatorButton({
  label,
  onClick,
  variant = "digit",
  isActive = false,
  gridColumn,
  gridRow,
}: CalculatorButtonProps) {
  const style = variantStyles[variant];
  const isHighlighted = isActive && variant === "operator";

  return (
    <Button
      onClick={onClick}
      h="58px"
      fontSize="lg"
      fontWeight="semibold"
      borderRadius="xl"
      bg={isHighlighted ? style.activeBg : style.bg}
      color={isHighlighted ? style.activeColor : style.color}
      transition="all 0.1s"
      variant="ghost"
      gridColumn={gridColumn}
      gridRow={gridRow}
      _active={{ transform: "scale(0.95)" }}
    >
      {label}
    </Button>
  );
}
