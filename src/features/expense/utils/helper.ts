/**
 * 금액 포맷팅 헬퍼 함수
 * @param amount 변환할 금액 (원화 기준)
 * @param options 포맷팅 옵션
 * @returns 포맷팅된 객체 { value: 값, unit: 단위, full: 전체 문자열 }
 */
interface FormatAmountOptions {
  showLocalCurrency: boolean; // 현지 통화 표시 여부
  isForeignCurrency: boolean; // 외국 통화 여부
  exchangeRate: number; // 환율
  targetCurrency: string; // 대상 통화 코드 (예: "usd", "jpy")
  currencySymbol: string; // 통화 심볼 (예: "$", "¥")
}

interface FormattedAmount {
  value: string; // 숫자 부분 (예: "100.00", "100,000")
  unit: string; // 단위 부분 (예: "$", "원")
  full: string; // 전체 문자열 (예: "$100.00", "100,000원")
}

export const formatAmount = (
  amount: number,
  options: FormatAmountOptions
): FormattedAmount => {
  const { showLocalCurrency, isForeignCurrency, exchangeRate, currencySymbol } =
    options;

  if (
    showLocalCurrency &&
    isForeignCurrency &&
    exchangeRate &&
    exchangeRate > 0
  ) {
    const localAmount = amount / exchangeRate;
    const value = Math.round(localAmount).toLocaleString();

    return {
      value,
      unit: currencySymbol,
      full: `${currencySymbol}${value}`,
    };
  }

  const value = amount.toLocaleString();
  return {
    value,
    unit: "원",
    full: `${value}원`,
  };
};
