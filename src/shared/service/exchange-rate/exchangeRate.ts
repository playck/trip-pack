const EXCHANGE_RATE_API_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

export interface ExchangeRateResponse {
  [currency: string]: Record<string, number>;
}

/**
 * 특정 통화 기준으로 환율 조회 API.
 * @param baseCurrency 기준 통화 (예: 'usd', 'jpy', 'eur')
 */
export const fetchExchangeRates = async (
  baseCurrency: string
): Promise<ExchangeRateResponse> => {
  const lowerBase = baseCurrency.toLowerCase();
  const res = await fetch(`${EXCHANGE_RATE_API_URL}/${lowerBase}.json`);

  if (!res.ok) {
    throw new Error("환율 정보를 불러오는데 실패했습니다.");
  }

  return await res.json();
};
