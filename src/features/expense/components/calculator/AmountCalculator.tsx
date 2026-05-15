import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
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

interface AmountCalculatorContextValue {
  display: ReactNode;
  keypad: ReactNode;
}

const AmountCalculatorContext =
  createContext<AmountCalculatorContextValue | null>(null);

function useAmountCalculatorContext(): AmountCalculatorContextValue {
  const ctx = useContext(AmountCalculatorContext);
  if (!ctx) {
    throw new Error(
      "AmountCalculator subcomponents must be used within AmountCalculatorProvider",
    );
  }
  return ctx;
}

export function AmountCalculatorProvider({
  onAmountChange,
  onCalculatingChange,
  initialValue,
  currencySymbol,
  currencyType,
  estimatedKrw,
  isForeignCurrency,
  onToggleCurrency,
  children,
}: AmountCalculatorProps & { children: ReactNode }) {
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

  const value: AmountCalculatorContextValue = {
    display: (
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
    ),
    keypad: (
      <CalculatorKeypad
        onDigit={inputDigit}
        onOperator={inputOperator}
        onEvaluate={evaluate}
        onClear={clear}
        onDelete={deleteLast}
        activeOperator={activeOperator}
      />
    ),
  };

  return (
    <AmountCalculatorContext.Provider value={value}>
      {children}
    </AmountCalculatorContext.Provider>
  );
}

export function AmountCalculatorDisplay() {
  return <>{useAmountCalculatorContext().display}</>;
}

export function AmountCalculatorKeypad() {
  return <>{useAmountCalculatorContext().keypad}</>;
}

// 기존 합본 컴포넌트 — Display + Keypad 같은 위치에 렌더하고 싶을 때
export default function AmountCalculator(props: AmountCalculatorProps) {
  return (
    <AmountCalculatorProvider {...props}>
      <VStack gap={2} w="full">
        <AmountCalculatorDisplay />
        <AmountCalculatorKeypad />
      </VStack>
    </AmountCalculatorProvider>
  );
}
