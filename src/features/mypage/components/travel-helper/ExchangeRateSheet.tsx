import { useState, useCallback } from "react";
import {
  Box,
  HStack,
  Input,
  Text,
  VStack,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "@/shared/service/exchange-rate/exchangeRate";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";

interface CurrencyInfo {
  code: string;
  name: string;
  flag: string;
  symbol: string;
}

const CURRENCY_LIST: CurrencyInfo[] = [
  { code: "usd", name: "미국 달러", flag: "🇺🇸", symbol: "$" },
  { code: "jpy", name: "일본 엔", flag: "🇯🇵", symbol: "¥" },
  { code: "eur", name: "유로", flag: "🇪🇺", symbol: "€" },
  { code: "cny", name: "중국 위안", flag: "🇨🇳", symbol: "¥" },
  { code: "twd", name: "대만 달러", flag: "🇹🇼", symbol: "NT$" },
  { code: "vnd", name: "베트남 동", flag: "🇻🇳", symbol: "₫" },
  { code: "thb", name: "태국 바트", flag: "🇹🇭", symbol: "฿" },
  { code: "sgd", name: "싱가포르 달러", flag: "🇸🇬", symbol: "S$" },
  { code: "hkd", name: "홍콩 달러", flag: "🇭🇰", symbol: "HK$" },
  { code: "gbp", name: "영국 파운드", flag: "🇬🇧", symbol: "£" },
  { code: "aud", name: "호주 달러", flag: "🇦🇺", symbol: "A$" },
  { code: "cad", name: "캐나다 달러", flag: "🇨🇦", symbol: "C$" },
  { code: "chf", name: "스위스 프랑", flag: "🇨🇭", symbol: "CHF" },
  { code: "php", name: "필리핀 페소", flag: "🇵🇭", symbol: "₱" },
  { code: "myr", name: "말레이시아 링깃", flag: "🇲🇾", symbol: "RM" },
  { code: "idr", name: "인도네시아 루피아", flag: "🇮🇩", symbol: "Rp" },
  { code: "nzd", name: "뉴질랜드 달러", flag: "🇳🇿", symbol: "NZ$" },
  { code: "inr", name: "인도 루피", flag: "🇮🇳", symbol: "₹" },
];

const NON_NUMERIC_REGEX = /[^0-9.]/g;
const COMMA_REGEX = /,/g;
const KOREAN_UNITS = ["", "만", "억", "조"] as const;

function formatKoreanNumber(value: string): string {
  const num = parseFloat(value.replace(COMMA_REGEX, ""));
  if (!num || isNaN(num) || num < 1) return "";

  const integer = Math.floor(num);
  if (integer < 10000) return "";

  const parts: string[] = [];
  let remaining = integer;

  for (let i = 0; remaining > 0 && i < KOREAN_UNITS.length; i++) {
    const chunk = remaining % 10000;
    if (chunk > 0) {
      parts.unshift(`${chunk.toLocaleString()}${KOREAN_UNITS[i]}`);
    }
    remaining = Math.floor(remaining / 10000);
  }

  return parts.join(" ");
}

interface ExchangeRateSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExchangeRateSheet({
  isOpen,
  onClose,
}: ExchangeRateSheetProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo | null>(
    null
  );
  const [foreignAmount, setForeignAmount] = useState("");
  const [krwAmount, setKrwAmount] = useState("");
  const [activeInput, setActiveInput] = useState<"foreign" | "krw">("foreign");

  const { data, isLoading } = useQuery({
    queryKey: ["exchangeRate", "krw"],
    queryFn: () => fetchExchangeRates("krw"),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: isOpen,
  });

  const rates = data?.krw as Record<string, number> | undefined;
  const rateDate = (data as Record<string, unknown>)?.date as
    | string
    | undefined;

  const getKrwPerUnit = useCallback(
    (code: string) => {
      if (!rates?.[code]) return 0;
      return 1 / rates[code];
    },
    [rates]
  );

  const formatRate = useCallback(
    (code: string) => {
      const krwPerUnit = getKrwPerUnit(code);
      if (krwPerUnit === 0) return "-";
      if (krwPerUnit < 1) return `${krwPerUnit.toFixed(4)}원`;
      if (krwPerUnit < 100) return `${krwPerUnit.toFixed(2)}원`;
      return `${Math.round(krwPerUnit).toLocaleString()}원`;
    },
    [getKrwPerUnit]
  );

  const formatNumber = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value < 1) return value.toFixed(4);
    if (value < 100) return value.toFixed(2);
    return Math.round(value).toLocaleString();
  }, []);

  const handleForeignAmountChange = useCallback(
    (value: string) => {
      setActiveInput("foreign");
      const cleaned = value.replace(NON_NUMERIC_REGEX, "");
      setForeignAmount(cleaned);

      if (!cleaned || !selectedCurrency || !rates?.[selectedCurrency.code]) {
        setKrwAmount("");
        return;
      }

      const num = parseFloat(cleaned);
      if (isNaN(num)) {
        setKrwAmount("");
        return;
      }

      const krw = num / rates[selectedCurrency.code];
      setKrwAmount(formatNumber(krw));
    },
    [selectedCurrency, rates, formatNumber]
  );

  const handleKrwAmountChange = useCallback(
    (value: string) => {
      setActiveInput("krw");
      const cleaned = value.replace(NON_NUMERIC_REGEX, "");
      setKrwAmount(cleaned);

      if (!cleaned || !selectedCurrency || !rates?.[selectedCurrency.code]) {
        setForeignAmount("");
        return;
      }

      const num = parseFloat(cleaned);
      if (isNaN(num)) {
        setForeignAmount("");
        return;
      }

      const foreign = num * rates[selectedCurrency.code];
      setForeignAmount(formatNumber(foreign));
    },
    [selectedCurrency, rates, formatNumber]
  );

  const handleSelectCurrency = useCallback((currency: CurrencyInfo) => {
    setSelectedCurrency(currency);
    setForeignAmount("");
    setKrwAmount("");
    setActiveInput("foreign");
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCurrency(null);
    setForeignAmount("");
    setKrwAmount("");
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCurrency(null);
    setForeignAmount("");
    setKrwAmount("");
    onClose();
  }, [onClose]);

  const title = selectedCurrency
    ? `${selectedCurrency.name} (${selectedCurrency.code.toUpperCase()})`
    : "환율 조회";

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      onBack={selectedCurrency ? handleBack : undefined}
      title={title}
      expanded
    >
      {rateDate && !isLoading && (
        <Text fontSize="xs" color="gray.400" textAlign="right" px={5} py={1}>
          {rateDate} 기준 환율
        </Text>
      )}
      {isLoading ? (
        <VStack py={10}>
          <Spinner color={colors.primary.fg} />
          <Text fontSize="sm" color="gray.500">
            환율 정보를 불러오는 중\u2026
          </Text>
        </VStack>
      ) : selectedCurrency ? (
        <CalculatorView
          currency={selectedCurrency}
          krwPerUnit={getKrwPerUnit(selectedCurrency.code)}
          foreignAmount={foreignAmount}
          krwAmount={krwAmount}
          activeInput={activeInput}
          onForeignAmountChange={handleForeignAmountChange}
          onKrwAmountChange={handleKrwAmountChange}
        />
      ) : (
        <CurrencyListView
          rates={rates}
          formatRate={formatRate}
          onSelect={handleSelectCurrency}
        />
      )}
    </BottomSheet>
  );
}

interface CurrencyListViewProps {
  rates: Record<string, number> | undefined;
  formatRate: (code: string) => string;
  onSelect: (currency: CurrencyInfo) => void;
}

function CurrencyListView({
  rates,
  formatRate,
  onSelect,
}: CurrencyListViewProps) {
  return (
    <VStack gap={0} px={4} pb={6}>
      {CURRENCY_LIST.map((currency) => (
        <Box
          key={currency.code}
          as="button"
          w="full"
          py={3}
          borderBottomWidth="1px"
          borderColor="gray.200"
          _last={{ borderBottomWidth: 0 }}
          _active={{ bg: "gray.50" }}
          onClick={() => onSelect(currency)}
        >
          <HStack justify="space-between">
            <HStack gap={3}>
              <Text fontSize="lg">{currency.flag}</Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.800">
                {currency.name}{" "}
                <Text as="span" color="gray.400">
                  ({currency.code.toUpperCase()})
                </Text>
              </Text>
            </HStack>
            <Text
              fontSize="sm"
              fontWeight="medium"
              color="gray.600"
              css={{ fontVariantNumeric: "tabular-nums" }}
            >
              {rates ? formatRate(currency.code) : "-"}
            </Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}

interface CalculatorViewProps {
  currency: CurrencyInfo;
  krwPerUnit: number;
  foreignAmount: string;
  krwAmount: string;
  activeInput: "foreign" | "krw";
  onForeignAmountChange: (value: string) => void;
  onKrwAmountChange: (value: string) => void;
}

function CalculatorView({
  currency,
  krwPerUnit,
  foreignAmount,
  krwAmount,
  activeInput,
  onForeignAmountChange,
  onKrwAmountChange,
}: CalculatorViewProps) {
  const rateDisplay =
    krwPerUnit === 0
      ? "-"
      : krwPerUnit < 1
        ? krwPerUnit.toFixed(4)
        : krwPerUnit < 100
          ? krwPerUnit.toFixed(2)
          : Math.round(krwPerUnit).toLocaleString();

  const foreignKorean = formatKoreanNumber(foreignAmount);
  const krwKorean = formatKoreanNumber(krwAmount);

  return (
    <VStack gap={4} px={5} pb={6}>
      <Flex w="full" justify="flex-end">
        <Text fontSize="md" fontWeight="semibold" color={colors.primary.fg}>
          1 {currency.code.toUpperCase()} = {rateDisplay} KRW
        </Text>
      </Flex>

      <VStack gap={3} w="full">
        <Box
          w="full"
          borderWidth="1.5px"
          borderColor={
            activeInput === "foreign" ? colors.primary.solid : "gray.200"
          }
          borderRadius="xl"
          px={4}
          py={3}
          transition="border-color 0.2s"
        >
          <HStack justify="space-between" mb={1.5}>
            <HStack gap={2}>
              <Text fontSize="lg">{currency.flag}</Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                {currency.code.toUpperCase()}
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.400">
              {currency.symbol}
            </Text>
          </HStack>
          <Input
            aria-label={`${currency.name} 금액 입력`}
            inputMode="decimal"
            placeholder="0"
            value={foreignAmount}
            variant="flushed"
            fontSize="xl"
            fontWeight="bold"
            textAlign="right"
            border="none"
            _focus={{ boxShadow: "none", borderColor: colors.primary.solid }}
            onChange={(e) => onForeignAmountChange(e.target.value)}
          />
          {foreignKorean ? (
            <Text fontSize="xs" color="gray.400" textAlign="right" mt={1}>
              {foreignKorean}
            </Text>
          ) : null}
        </Box>

        <Text fontSize="xl" color="gray.400" fontWeight="bold">
          ↕
        </Text>

        <Box
          w="full"
          borderWidth="1.5px"
          borderColor={
            activeInput === "krw" ? colors.primary.solid : "gray.200"
          }
          borderRadius="xl"
          px={4}
          py={3}
          transition="border-color 0.2s"
        >
          <HStack justify="space-between" mb={1.5}>
            <HStack gap={2}>
              <Text fontSize="lg">🇰🇷</Text>
              <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                KRW
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.400">
              ₩
            </Text>
          </HStack>
          <Input
            aria-label="원화 금액 입력"
            inputMode="decimal"
            placeholder="0"
            value={krwAmount}
            variant="flushed"
            fontSize="xl"
            fontWeight="bold"
            textAlign="right"
            border="none"
            _focus={{ boxShadow: "none", borderColor: colors.primary.solid }}
            onChange={(e) => onKrwAmountChange(e.target.value)}
          />
          {krwKorean ? (
            <Text fontSize="xs" color="gray.400" textAlign="right" mt={1}>
              {krwKorean}
            </Text>
          ) : null}
        </Box>
      </VStack>
    </VStack>
  );
}
