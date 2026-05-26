import type { TripBasicInfo } from "../types";

interface ExportSettlementParams {
  tripInfo: TripBasicInfo;
  totalAmount: number;
  memberCount: number;
  exchangeRate?: number;
  currencySymbol?: string;
  showLocalCurrency?: boolean;
}

const formatAmount = (
  amount: number,
  exchangeRate: number,
  currencySymbol: string,
  showLocalCurrency: boolean,
): string => {
  if (showLocalCurrency && exchangeRate > 0) {
    const local = Math.round(amount / exchangeRate);
    return `${currencySymbol}${local.toLocaleString()}`;
  }
  return `${amount.toLocaleString()}원`;
};

export function formatSettlementToText(
  params: ExportSettlementParams,
): string {
  const {
    tripInfo,
    totalAmount,
    memberCount,
    exchangeRate = 0,
    currencySymbol = "",
    showLocalCurrency = false,
  } = params;

  const fmt = (n: number) =>
    formatAmount(n, exchangeRate, currencySymbol, showLocalCurrency);

  const title = tripInfo.title || "여행";
  const perPerson =
    memberCount > 0 ? Math.round(totalAmount / memberCount) : 0;

  let text = `💸 ${title} 정산 리포트\n`;
  text += `━━━━━━━━━━━━━━\n`;
  text += `💰 공동 경비 총액: ${fmt(totalAmount)}\n`;
  text += `👥 분담 멤버: ${memberCount}명\n`;
  if (memberCount > 0) {
    text += `💸 1인당 평균: ${fmt(perPerson)}\n`;
  }

  return text;
}
