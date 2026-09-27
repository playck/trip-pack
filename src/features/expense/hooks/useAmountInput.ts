import { useState, useCallback, type ChangeEvent } from "react";

export type CurrencyType = "KRW" | "LOCAL";

/**
 * 입력 금액을 저장할 원화 금액으로 변환.
 * 현지 통화인데 환율이 없으면(오프라인·환율 API 실패) null — 현지 숫자를 원화로 저장하지 않게 한다.
 */
export function toKrw(
  amount: number,
  currencyType: CurrencyType,
  exchangeRate: number,
): number | null {
  if (currencyType === "KRW") return amount;
  if (exchangeRate > 0) return Math.round(amount * exchangeRate);
  return null;
}

/** 입력칸에 표시된 금액 문자열("1,234")을 숫자로 */
export function parseAmountText(text: string): number {
  return text ? parseFloat(text.replace(/,/g, "")) : 0;
}

/** toKrw가 null일 때(환율 없음) 저장을 막으며 띄우는 안내 */
export const RATE_MISSING_TOAST = {
  title: "환율을 불러오지 못했어요",
  description:
    "지금은 현지 통화로 저장할 수 없어요. 원화로 바꿔 입력하거나 연결을 확인한 뒤 다시 시도해 주세요.",
  type: "warning",
} as const;

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
      setAmount(parseInt(value, 10).toLocaleString("ko-KR"));
    } else {
      setAmount("");
    }
  };

  const parsedAmount = parseAmountText(amount);

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
  const toKrwAmount = () => toKrw(parsedAmount, currencyType, exchangeRate);

  /** 숫자값으로 금액 직접 설정 (계산기 연동용) */
  // 로케일 고정: 기기 지역이 "1.200"(독일 등) 표기면 parseAmountText가 1로 잘못 읽는다
  const setAmountFromNumber = useCallback((value: number) => {
    setAmount(value > 0 ? value.toLocaleString("ko-KR") : "");
  }, []);

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
    setAmountFromNumber,
    reset,
  };
}
