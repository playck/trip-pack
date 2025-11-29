import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "../service/exchange-rate/exchangeRate";

export type CurrencyCode =
  | "usd"
  | "krw"
  | "jpy"
  | "eur"
  | "cny"
  | "twd"
  | "vnd"
  | string;

interface UseExchangeRateResult {
  rate: number;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 환율 조회 Hook
 * @param baseCurrency 기준 통화 (내가 가진 돈, 예: 'krw')
 * @param targetCurrency 대상 통화 (환전할 돈, 예: 'usd')
 */
export const useExchangeRate = (
  baseCurrency: CurrencyCode,
  targetCurrency: CurrencyCode
): UseExchangeRateResult => {
  const lowerBase = baseCurrency.toLowerCase();
  const lowerTarget = targetCurrency.toLowerCase();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchangeRate", lowerBase],
    queryFn: () => fetchExchangeRates(lowerBase),
    staleTime: 1000 * 60 * 60 * 24, // 24시간
    enabled: !!baseCurrency,
  });

  const rate = data && data[lowerBase] ? data[lowerBase][lowerTarget] : 0;

  return {
    rate,
    isLoading,
    isError,
  };
};
