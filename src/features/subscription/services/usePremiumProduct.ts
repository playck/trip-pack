import { useQuery } from "@tanstack/react-query";
import {
  PAYMENT_LIVE,
  PREMIUM_PRICE_FALLBACK,
  PREMIUM_PRODUCT_ID,
} from "@/shared/constants/app";
import {
  hasNativeCapability,
  requestPremiumProduct,
  type PremiumProductInfo,
} from "@/shared/utils/nativeMessage";

/** 가격은 사용자와 무관한 스토어 값이라 유저별로 캐시를 나누지 않는다. */
export const premiumProductQueryKey = [
  "subscription",
  "product",
  "premium",
] as const;

interface UsePremiumProductOptions {
  enabled?: boolean;
}

interface UsePremiumProductReturn {
  /** 스토어 현지화 가격. 못 받으면(웹·구버전 앱·조회 실패) 상수 폴백, 폴백도 없으면 null. */
  product: PremiumProductInfo | null;
  isLoading: boolean;
}

const fallbackProduct: PremiumProductInfo | null = PREMIUM_PRICE_FALLBACK
  ? { productId: PREMIUM_PRODUCT_ID, ...PREMIUM_PRICE_FALLBACK }
  : null;

/**
 * 프리미엄 상품의 표시용 가격. 스토어(RevenueCat) 현지화 가격을 우선하고, 받지 못하면 상수 폴백을 사용.
 * 앱 바이너리가 premiumProduct 브릿지를 지원할 때만 조회하며, 결제 미오픈 시에는 호출하지 않는다.
 * 응답이 없을 수 있는 환경은 hasNativeCapability로 걸러지므로 재시도 X.
 */
export function usePremiumProduct(
  options?: UsePremiumProductOptions,
): UsePremiumProductReturn {
  const canQuery = PAYMENT_LIVE && hasNativeCapability("premiumProduct");

  const { data, isLoading } = useQuery({
    queryKey: premiumProductQueryKey,
    queryFn: requestPremiumProduct,
    enabled: canQuery && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  return {
    product: data ?? fallbackProduct,
    isLoading,
  };
}
