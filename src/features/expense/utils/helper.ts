/**
 * 금액 포맷팅 헬퍼 함수
 * @param amount 변환할 금액 (원화 기준)
 * @param options 포맷팅 옵션
 * @returns 포맷팅된 문자열 (예: "$100.00" 또는 "100,000원")
 */
interface FormatAmountOptions {
  showLocalCurrency: boolean; // 현지 통화 표시 여부
  isForeignCurrency: boolean; // 외국 통화 여부
  exchangeRate: number; // 환율
  targetCurrency: string; // 대상 통화 코드 (예: "usd", "jpy")
  currencySymbol: string; // 통화 심볼 (예: "$", "¥")
}

export const formatAmount = (
  amount: number,
  options: FormatAmountOptions
): string => {
  const {
    showLocalCurrency,
    isForeignCurrency,
    exchangeRate,
    targetCurrency,
    currencySymbol,
  } = options;

  if (
    showLocalCurrency &&
    isForeignCurrency &&
    exchangeRate &&
    exchangeRate > 0
  ) {
    const localAmount = amount / exchangeRate;
    const decimals =
      targetCurrency.toLowerCase() === "jpy" ||
      targetCurrency.toLowerCase() === "vnd"
        ? 0
        : 2;
    return `${currencySymbol}${localAmount.toLocaleString(undefined, { maximumFractionDigits: decimals })}`;
  }
  return `${amount.toLocaleString()}원`;
};
