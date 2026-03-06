import { useState } from "react";
import { Box, VStack, HStack, Text, Input, Button } from "@chakra-ui/react";
import { Search, Plane, PlaneLanding } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors, hexColors } from "@/shared/constants/colors";
import { searchFlightsBoth } from "../services/flightApi";
import type { FlightSearchResult } from "../services/flightApi";
import { useCreateFlight } from "../services/useFlightQueries";
import { formatFlightTime } from "../utils";
import type { TripFlightInsert } from "../types";

interface AddFlightSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  startDate: string;
  endDate: string;
}

export default function AddFlightSheet({
  isOpen,
  onClose,
  tripId,
  startDate,
  endDate,
}: AddFlightSheetProps) {
  const [flightId, setFlightId] = useState("");
  const [manualType, setManualType] = useState<"departure" | "return">(
    "departure",
  );
  const [searchResults, setSearchResults] = useState<FlightSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const createFlight = useCreateFlight(tripId);

  const handleSearch = async () => {
    if (!flightId.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const results = await searchFlightsBoth(flightId.trim());
      if (results.length === 0) {
        setSearchError("검색 결과가 없습니다. 편명을 확인해주세요.");
      } else {
        setSearchResults(results);
      }
    } catch {
      setSearchError("항공편 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item: FlightSearchResult) => {
    const scheduleTime =
      item.scheduleDateTime.length >= 4
        ? formatFlightTime(item.scheduleDateTime)
        : null;

    const type = item._flightType;
    const autoDate = type === "departure" ? startDate : endDate;

    const flight: TripFlightInsert = {
      trip_id: tripId,
      flight_id: item.flightId,
      airline: item.airline,
      departure_airport: type === "departure" ? "ICN" : item.airport,
      arrival_airport: type === "departure" ? item.airport : "ICN",
      scheduled_date: autoDate,
      scheduled_time: scheduleTime,
      flight_type: type,
    };

    createFlight.mutate(flight, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleManualRegister = () => {
    if (!flightId.trim()) return;

    const flight: TripFlightInsert = {
      trip_id: tripId,
      flight_id: flightId.trim().toUpperCase(),
      airline: "",
      departure_airport: manualType === "departure" ? "ICN" : "",
      arrival_airport: manualType === "departure" ? "" : "ICN",
      scheduled_date: manualType === "departure" ? startDate : endDate,
      scheduled_time: null,
      flight_type: manualType,
    };

    createFlight.mutate(flight, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFlightId("");
    setManualType("departure");
    setSearchResults([]);
    setSearchError("");
    setIsSearching(false);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title="항공편 등록"
      minHeight="95vh"
    >
      <VStack px={4} pb={6} gap={4} align="stretch">
        {/* 편명 검색 */}
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            편명 (예: KE123, OZ101)
          </Text>
          <HStack gap={2}>
            <Input
              placeholder="편명을 입력하세요"
              value={flightId}
              onChange={(e) => setFlightId(e.target.value.trim().toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              size="md"
              flex={1}
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              autoComplete="off"
              lang="en"
            />
            <Button
              colorPalette={colors.primary.palette}
              size="md"
              onClick={handleSearch}
              loading={isSearching}
              disabled={!flightId.trim()}
            >
              <Search size={16} />
            </Button>
          </HStack>
        </VStack>

        {/* 검색 결과 */}
        {searchError && (
          <VStack gap={4} align="center">
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {searchError}
            </Text>
            <VStack gap={3} w="80%">
              <HStack gap={2} w="full">
                <Button
                  flex={1}
                  size="md"
                  variant={manualType === "departure" ? "solid" : "outline"}
                  colorPalette={
                    manualType === "departure" ? colors.primary.palette : "gray"
                  }
                  onClick={() => setManualType("departure")}
                >
                  <Plane size={16} />
                  <Text ml={1}>출발편</Text>
                </Button>
                <Button
                  flex={1}
                  size="md"
                  variant={manualType === "return" ? "solid" : "outline"}
                  colorPalette={
                    manualType === "return" ? colors.primary.palette : "gray"
                  }
                  onClick={() => setManualType("return")}
                >
                  <PlaneLanding size={16} />
                  <Text ml={1}>리턴편</Text>
                </Button>
              </HStack>
              <Button
                variant="outline"
                size="lg"
                w="full"
                colorPalette="gray"
                onClick={handleManualRegister}
                loading={createFlight.isPending}
              >
                편명으로 직접 등록
              </Button>
            </VStack>
          </VStack>
        )}

        {searchResults.length > 0 && (
          <VStack align="stretch" gap={2}>
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              검색 결과 ({searchResults.length}건) - 탭하여 등록
            </Text>
            {searchResults.map((item, idx) => (
              <Box
                key={`${item.flightId}-${idx}`}
                as="button"
                w="full"
                p={3}
                bg="gray.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.200"
                opacity={createFlight.isPending ? 0.5 : 1}
                pointerEvents={createFlight.isPending ? "none" : "auto"}
                textAlign="left"
                cursor="pointer"
                _hover={{ bg: "gray.100", borderColor: colors.primary.muted }}
                onClick={() => handleSelect(item)}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" gap={0.5}>
                    <HStack gap={2}>
                      <Text fontSize="sm" fontWeight="bold">
                        {item.flightId}
                      </Text>
                      <Text
                        fontSize="2xs"
                        px={1.5}
                        py={0.5}
                        borderRadius="sm"
                        bg={
                          item._flightType === "departure"
                            ? colors.primary.subtle
                            : colors.primary.subtle
                        }
                        color={
                          item._flightType === "departure"
                            ? colors.primary.fg
                            : colors.primary.fg
                        }
                        fontWeight="medium"
                      >
                        {item._flightType === "departure" ? "출발" : "도착"}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.airline}
                      </Text>
                    </HStack>
                    <HStack gap={1}>
                      <Text fontSize="xs" color="gray.600">
                        {item._flightType === "departure"
                          ? "인천"
                          : item.airport}
                      </Text>
                      <Plane size={12} color={hexColors.gray[400]} />
                      <Text fontSize="xs" color="gray.600">
                        {item._flightType === "departure"
                          ? item.airport
                          : "인천"}
                      </Text>
                    </HStack>
                  </VStack>
                  <VStack align="end" gap={0}>
                    <Text fontSize="xs" color="gray.500">
                      {formatFlightTime(item.scheduleDateTime)}
                    </Text>
                    {item.remark && (
                      <Text
                        fontSize="xs"
                        color={item.remark === "결항" ? "red.500" : "gray.500"}
                      >
                        {item.remark}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </BottomSheet>
  );
}
