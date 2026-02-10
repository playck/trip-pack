import { useState, type ChangeEvent } from "react";

export type CurrencyType = "KRW" | "LOCAL";

interface UseAmountInputOptions {
  exchangeRate?: number;
  initialCurrencyType?: CurrencyType;
}

export function useAmountInput(options: UseAmountInputOptions = {}) {
  const { exchangeRate = 0, initialCurrencyType = "KRW" } = options;

  const [amount, setAmount] = useState("");
  const [currencyType, setCurrencyType] =
    useState<CurrencyType>(initialCurrencyType);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value) {
      setAmount(parseInt(value, 10).toLocaleString());
    } else {
      setAmount("");
    }
  };

  const parsedAmount = amount
    ? parseInt(amount.replace(/,/g, ""), 10)
    : 0;

  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const toggleCurrencyType = () => {
    setCurrencyType((prev) => (prev === "KRW" ? "LOCAL" : "KRW"));
  };

  /** 현지통화 입력 시 원화 환산 예상값 (표시용) */
  const estimatedKrw =
    currencyType === "LOCAL" && isValidAmount && exchangeRate > 0
      ? Math.round(parsedAmount * exchangeRate).toLocaleString()
      : null;

  /** 최종 원화 금액 반환 (현지통화 입력 시 환산 포함) */
  const toKrwAmount = (): number => {
    if (currencyType === "LOCAL" && exchangeRate > 0) {
      return Math.round(parsedAmount * exchangeRate);
    }
    return parsedAmount;
  };

  /** 금액 및 통화 타입 초기화 */
  const reset = (newAmount = "") => {
    setAmount(newAmount);
    setCurrencyType(initialCurrencyType);
  };

  return {
    amount,
    setAmount,
    handleAmountChange,
    parsedAmount,
    isValidAmount,
    currencyType,
    toggleCurrencyType,
    estimatedKrw,
    toKrwAmount,
    reset,
  };
}
