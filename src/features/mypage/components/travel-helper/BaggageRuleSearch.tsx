import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Box, Input, Separator, Text, VStack } from "@chakra-ui/react";
import { Search } from "lucide-react";
import {
  checkBaggageRules,
  type BaggageCheckResult,
} from "@/shared/utils/baggageChecker";
import BottomSheet from "@/shared/components/BottomSheet";
import BaggageRuleResult from "./BaggageRuleResult";

const MAX_RESULTS = 3;

interface BaggageRuleSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BaggageRuleSearchSheet({
  isOpen,
  onClose,
}: BaggageRuleSearchSheetProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<BaggageCheckResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useDebounceCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setResults(checkBaggageRules(trimmed).slice(0, MAX_RESULTS));
    setHasSearched(true);
  }, 300);

  const handleClose = () => {
    setSearch("");
    setResults([]);
    setHasSearched(false);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="수하물 규정 검색"
      size="max"
    >
      <VStack align="stretch" px={4} pb={6} pt={1} gap={3}>
        <Box position="relative">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            zIndex={1}
          >
            <Search size={16} />
          </Box>
          <Input
            autoFocus
            placeholder="물품명을 입력하세요 (예: 보조배터리, 김치)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              debouncedSearch(e.target.value);
            }}
            pl={9}
            size="sm"
            borderRadius="lg"
            bg="gray.50"
          />
        </Box>

        {hasSearched &&
          (results.length > 0 ? (
            <VStack align="stretch" gap={4}>
              {results.map((result, index) => (
                <VStack key={result.item.name} align="stretch" gap={4}>
                  {index > 0 && <Separator />}
                  <BaggageRuleResult item={result.item} />
                </VStack>
              ))}
            </VStack>
          ) : (
            <Box py={6} textAlign="center">
              <VStack gap={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="medium">
                  매칭된 검색 결과가 없어요
                </Text>
                <Text fontSize="xs" color="gray.400" lineHeight="1.6" px={4}>
                  검색 결과에 없는 일반 물품은 대부분 기내·위탁 모두 반입
                  가능해요. 다만 날카로운 물품, 배터리, 액체, 스프레이류는
                  규정이 있을 수 있으니 항공보안365(avsec365.or.kr)에서
                  확인해주세요.
                </Text>
              </VStack>
            </Box>
          ))}
      </VStack>
    </BottomSheet>
  );
}
