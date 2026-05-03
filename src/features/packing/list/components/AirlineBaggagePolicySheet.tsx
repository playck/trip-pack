import { useState, useMemo } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Box, Text, VStack, HStack, Input, Badge } from "@chakra-ui/react";
import {
  Briefcase,
  Luggage,
  Search,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";

import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { BAGGAGE_POLICY_BY_AIR } from "@/shared/data/baggagePolicyByAir";

interface AirlineBaggagePolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AirlineBaggagePolicySheet({
  isOpen,
  onClose,
}: AirlineBaggagePolicySheetProps) {
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const debouncedFilter = useDebounceCallback(setKeyword, 250);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return BAGGAGE_POLICY_BY_AIR;

    return BAGGAGE_POLICY_BY_AIR.filter(
      (a) =>
        a.airline.toLowerCase().includes(k) ||
        a.iataCode.toLowerCase().includes(k)
    );
  }, [keyword]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const airline of filtered) {
      const list = map.get(airline.country) ?? [];
      list.push(airline);
      map.set(airline.country, list);
    }
    return map;
  }, [filtered]);

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="항공사별 수하물 규정"
      expanded
    >
      <VStack align="stretch" gap={0} h="calc(90vh - 60px)">
        {/* 고정 영역: 검색 + 안내 */}
        <Box px={4} pb={2} pt={1} flexShrink={0}>
          <Box position="relative" mb={1}>
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
              placeholder="항공사명 또는 코드 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debouncedFilter(e.target.value);
              }}
              pl={9}
              size="sm"
              borderRadius="lg"
              bg="gray.50"
            />
          </Box>
          <HStack gap={1.5}>
            <Box color="gray.400">
              <Info size={12} />
            </Box>
            <Text fontSize="2xs" color="gray.400">
              실제 허용량은 운임 등급에 따라 상이할 수 있습니다
            </Text>
          </HStack>
        </Box>

        {/* 리스트 */}
        <Box flex={1} overflowY="auto" px={4} pb={6}>
          {grouped.size === 0 ? (
            <Box py={12} textAlign="center">
              <Text fontSize="sm" color="gray.400">
                검색 결과가 없습니다
              </Text>
            </Box>
          ) : (
            Array.from(grouped.entries()).map(([country, airlines]) => (
              <Box key={country} mb={4}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.500"
                  mb={2}
                >
                  {country}
                </Text>

                <VStack align="stretch" gap={2}>
                  {airlines.map((airline) => {
                    const isExpanded = expandedId === airline.id;

                    return (
                      <Box
                        key={airline.id}
                        borderWidth="1px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => handleToggle(airline.id)}
                      >
                        <HStack px={3} py={2.5} justify="space-between">
                          <HStack gap={2}>
                            <Badge
                              size="sm"
                              colorPalette={colors.primary.palette}
                              variant="subtle"
                              fontWeight="bold"
                              fontSize="xs"
                            >
                              {airline.iataCode}
                            </Badge>
                            <Text fontSize="sm" fontWeight="medium">
                              {airline.airline}
                            </Text>
                          </HStack>
                          <Box color="gray.400">
                            {isExpanded ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Box>
                        </HStack>

                        {isExpanded && (
                          <VStack
                            align="stretch"
                            gap={2}
                            px={3}
                            pb={3}
                            pt={1}
                            borderTopWidth="1px"
                            borderColor="gray.100"
                          >
                            <HStack gap={2}>
                              <Box color="cyan.500">
                                <Briefcase size={15} />
                              </Box>
                              <Text fontSize="xs" color="gray.600">
                                기내: {airline.cabinBaggage}
                              </Text>
                            </HStack>
                            <HStack gap={2}>
                              <Box color="purple.500">
                                <Luggage size={15} />
                              </Box>
                              <Text fontSize="xs" color="gray.600">
                                위탁: {airline.checkedBaggage}
                              </Text>
                            </HStack>
                          </VStack>
                        )}
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            ))
          )}
        </Box>
      </VStack>
    </BottomSheet>
  );
}
