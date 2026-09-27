import { useState, useCallback, useMemo } from "react";

type Operator = "+" | "-" | "×" | "÷";

interface CalculatorState {
  currentInput: string;
  previousOperand: number | null;
  operator: Operator | null;
  expressionPrefix: string;
  evaluatedExpression: string;
  justEvaluated: boolean;
}

const MAX_DIGITS = 12;

const initialState: CalculatorState = {
  currentInput: "0",
  previousOperand: null,
  operator: null,
  expressionPrefix: "",
  evaluatedExpression: "",
  justEvaluated: false,
};

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatInput(input: string): string {
  if (input.endsWith(".")) {
    const intPart = parseInt(input, 10);
    return (isNaN(intPart) ? "0" : formatNumber(intPart)) + ".";
  }
  if (input.includes(".")) {
    const [intPart, decPart] = input.split(".");
    return `${formatNumber(parseInt(intPart, 10) || 0)}.${decPart}`;
  }
  const num = parseInt(input, 10);
  if (isNaN(num)) return "0";
  return formatNumber(num);
}

function parseInput(input: string): number {
  return parseFloat(input) || 0;
}

function roundTo(n: number, fractionDigits: number): number {
  const factor = 10 ** fractionDigits;
  return Math.round(n * factor) / factor;
}

function digitCount(input: string): number {
  return input.replace(".", "").replace(/^0+/, "").length || 1;
}

function calculate(a: number, op: Operator, b: number): number | null {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? null : a / b;
    default:
      return b;
  }
}

/** @param fractionDigits 결과에 남길 소수 자릿수 (원화 0, 현지 통화 2) */
export function useCalculator(fractionDigits = 0) {
  const [state, setState] = useState<CalculatorState>(initialState);

  const inputDigit = useCallback((digit: string) => {
    setState((prev) => {
      // = 직후 숫자 → 완전히 새 시작
      if (prev.justEvaluated) {
        if (digit === ".") {
          return { ...initialState, currentInput: "0." };
        }
        return { ...initialState, currentInput: digit };
      }

      if (digit === ".") {
        if (prev.currentInput.includes(".")) return prev;
        return { ...prev, currentInput: prev.currentInput + ".", justEvaluated: false };
      }

      const current = prev.currentInput === "0" ? "" : prev.currentInput;
      if (digitCount(current + digit) > MAX_DIGITS) return prev;
      // 소수 자릿수 제한은 현지 통화만 (원화는 기존대로 입력 후 반올림)
      const decimals = current.split(".")[1];
      if (fractionDigits > 0 && decimals !== undefined && decimals.length >= fractionDigits) {
        return prev;
      }

      const newInput = current + digit;
      return { ...prev, currentInput: newInput || "0", justEvaluated: false };
    });
  }, [fractionDigits]);

  const inputOperator = useCallback((op: Operator) => {
    setState((prev) => {
      const currentNum = parseInput(prev.currentInput);

      // = 직후 연산자 → 결과에서 이어서 연산
      if (prev.justEvaluated) {
        return {
          currentInput: "0",
          previousOperand: currentNum,
          operator: op,
          expressionPrefix: `${formatNumber(currentNum)} ${op} `,
          evaluatedExpression: "",
          justEvaluated: false,
        };
      }

      // 체인 연산
      if (prev.operator && prev.previousOperand !== null) {
        const result = calculate(prev.previousOperand, prev.operator, currentNum);
        if (result === null) {
          return { ...prev, operator: op };
        }
        return {
          currentInput: "0",
          previousOperand: result,
          operator: op,
          expressionPrefix: `${formatNumber(result)} ${op} `,
          evaluatedExpression: "",
          justEvaluated: false,
        };
      }

      return {
        currentInput: "0",
        previousOperand: currentNum,
        operator: op,
        expressionPrefix: `${formatNumber(currentNum)} ${op} `,
        evaluatedExpression: "",
        justEvaluated: false,
      };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState((prev) => {
      if (prev.operator === null || prev.previousOperand === null) return prev;

      const currentNum = parseInput(prev.currentInput);
      const result = calculate(prev.previousOperand, prev.operator, currentNum);

      if (result === null) {
        return { ...initialState, justEvaluated: true };
      }

      const fullExpression = `${formatNumber(prev.previousOperand)} ${prev.operator} ${formatInput(prev.currentInput)}`;
      const rounded = roundTo(result, fractionDigits);

      return {
        currentInput: String(Math.max(0, rounded)),
        previousOperand: null,
        operator: null,
        expressionPrefix: "",
        evaluatedExpression: fullExpression,
        justEvaluated: true,
      };
    });
  }, [fractionDigits]);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  const deleteLast = useCallback(() => {
    setState((prev) => {
      if (prev.justEvaluated) return prev;
      const newInput = prev.currentInput.slice(0, -1) || "0";
      return { ...prev, currentInput: newInput };
    });
  }, []);

  const setInitialValue = useCallback((value: number) => {
    setState({
      ...initialState,
      currentInput: String(Math.max(0, roundTo(value, fractionDigits))),
    });
  }, [fractionDigits]);

  const displayValue = useMemo(() => formatInput(state.currentInput), [state.currentInput]);

  const expression = useMemo(() => {
    // = 직후: 수식을 위에 표시
    if (state.justEvaluated) return state.evaluatedExpression;
    // 연산 중: 메인에 수식 표시용
    if (state.operator && state.currentInput !== "0") {
      return `${state.expressionPrefix}${formatInput(state.currentInput)}`;
    }
    if (state.operator) return state.expressionPrefix.trimEnd();
    return "";
  }, [state]);

  const resultValue = useMemo(() => {
    return roundTo(parseInput(state.currentInput), fractionDigits);
  }, [state.currentInput, fractionDigits]);

  const hasExpression = state.operator !== null;
  const isValid = resultValue > 0;

  return {
    displayValue,
    expression,
    hasExpression,
    activeOperator: state.operator,
    resultValue,
    isValid,
    inputDigit,
    inputOperator,
    evaluate,
    clear,
    deleteLast,
    setInitialValue,
  };
}
