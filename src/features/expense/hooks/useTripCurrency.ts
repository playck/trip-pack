import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { useExchangeRate } from "@/shared/service/trip/useExchangeRate";
import {
  getCurrencyByCountryCode,
  getCurrencySymbol,
} from "@/shared/utiles/currency";

export function useTripCurrency(tripId: string) {
  const { data: tripInfo } = useTripInfo(tripId);
  const targetCurrency = getCurrencyByCountryCode(tripInfo?.countryCode);
  const currencySymbol = getCurrencySymbol(targetCurrency);
  const isForeignCurrency = targetCurrency.toLowerCase() !== "krw";

  const { rate: exchangeRate, isLoading: isRateLoading } = useExchangeRate(
    targetCurrency,
    "krw",
    { enabled: isForeignCurrency },
  );

  return {
    tripInfo,
    targetCurrency,
    currencySymbol,
    isForeignCurrency,
    exchangeRate: exchangeRate || 0,
    isRateLoading,
  };
}
