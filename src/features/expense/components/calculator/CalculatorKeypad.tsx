import { Grid, Box } from "@chakra-ui/react";
import CalculatorButton from "./CalculatorButton";

type Operator = "+" | "-" | "×" | "÷";

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onEvaluate: () => void;
  onClear: () => void;
  onDelete: () => void;
  activeOperator: Operator | null;
}

export default function CalculatorKeypad({
  onDigit,
  onOperator,
  onEvaluate,
  onClear,
  onDelete,
  activeOperator,
}: CalculatorKeypadProps) {
  return (
    <Grid
      templateColumns="repeat(4, 1fr)"
      templateRows="repeat(5, 1fr)"
      gap={2}
      w="full"
    >
      {/* Row 1 */}
      <Box />
      <CalculatorButton label="AC" onClick={onClear} variant="action" />
      <CalculatorButton label="⌫" onClick={onDelete} variant="action" />
      <CalculatorButton
        label="÷"
        onClick={() => onOperator("÷")}
        variant="operator"
        isActive={activeOperator === "÷"}
      />

      {/* Row 2 */}
      <CalculatorButton label="7" onClick={() => onDigit("7")} />
      <CalculatorButton label="8" onClick={() => onDigit("8")} />
      <CalculatorButton label="9" onClick={() => onDigit("9")} />
      <CalculatorButton
        label="×"
        onClick={() => onOperator("×")}
        variant="operator"
        isActive={activeOperator === "×"}
      />

      {/* Row 3 */}
      <CalculatorButton label="4" onClick={() => onDigit("4")} />
      <CalculatorButton label="5" onClick={() => onDigit("5")} />
      <CalculatorButton label="6" onClick={() => onDigit("6")} />
      <CalculatorButton
        label="-"
        onClick={() => onOperator("-")}
        variant="operator"
        isActive={activeOperator === "-"}
      />

      {/* Row 4 */}
      <CalculatorButton label="1" onClick={() => onDigit("1")} />
      <CalculatorButton label="2" onClick={() => onDigit("2")} />
      <CalculatorButton label="3" onClick={() => onDigit("3")} />
      <CalculatorButton
        label="+"
        onClick={() => onOperator("+")}
        variant="operator"
        isActive={activeOperator === "+"}
      />

      {/* Row 5 */}
      <CalculatorButton
        label="0"
        onClick={() => onDigit("0")}
        gridColumn="1 / 3"
      />
      <CalculatorButton label="." onClick={() => onDigit(".")} />
      <CalculatorButton label="=" onClick={onEvaluate} variant="equal" />
    </Grid>
  );
}
