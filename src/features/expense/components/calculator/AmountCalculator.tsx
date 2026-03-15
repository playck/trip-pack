import { useEffect, useRef } from "react";
import { VStack } from "@chakra-ui/react";
import { useCalculator } from "../../hooks/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeypad from "./CalculatorKeypad";
import type { CurrencyType } from "../../hooks/useAmountInput";

interface AmountCalculatorProps {
  onAmountChange: (value: number) => void;
  onCalculatingChange?: (isCalculating: boolean) => void;
  initialValue?: number;
  currencySymbol?: string;
  currencyType?: CurrencyType;
  estimatedKrw?: string | null;
  isForeignCurrency?: boolean;
  onToggleCurrency?: () => void;
}

export default function AmountCalculator({
  onAmountChange,
  onCalculatingChange,
  initialValue,
  currencySymbol,
  currencyType,
  estimatedKrw,
  isForeignCurrency,
  onToggleCurrency,
}: AmountCalculatorProps) {
  const {
    displayValue,
    expression,
    hasExpression,
    activeOperator,
    resultValue,
    inputDigit,
    inputOperator,
    evaluate,
    clear,
    deleteLast,
    setInitialValue,
  } = useCalculator();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initialValue && initialValue > 0 && !initializedRef.current) {
      setInitialValue(initialValue);
      initializedRef.current = true;
    }
  }, [initialValue, setInitialValue]);

  useEffect(() => {
    if (!hasExpression) {
      onAmountChange(resultValue);
    }
  }, [resultValue, hasExpression, onAmountChange]);

  useEffect(() => {
    onCalculatingChange?.(hasExpression);
  }, [hasExpression, onCalculatingChange]);

  return (
    <VStack gap={2} w="full">
      <CalculatorDisplay
        displayValue={displayValue}
        expression={expression}
        hasExpression={hasExpression}
        currencySymbol={currencySymbol}
        currencyType={currencyType}
        estimatedKrw={estimatedKrw}
        isForeignCurrency={isForeignCurrency}
        onToggleCurrency={onToggleCurrency}
      />
      <CalculatorKeypad
        onDigit={inputDigit}
        onOperator={inputOperator}
        onEvaluate={evaluate}
        onClear={clear}
        onDelete={deleteLast}
        activeOperator={activeOperator}
      />
    </VStack>
  );
}
