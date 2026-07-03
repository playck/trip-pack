import { useState, useEffect, useRef } from "react";
import {
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Wrap,
  SegmentGroup,
} from "@chakra-ui/react";
import { Plane, PlaneLanding } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import { useCreateFlight } from "../services/useFlightQueries";
import type { TripFlightInsert, TripFlight } from "../types";

const POPULAR_AIRLINES = [
  { code: "KE", name: "대한항공" },
  { code: "OZ", name: "아시아나" },
  { code: "TW", name: "티웨이" },
  { code: "LJ", name: "진에어" },
  { code: "7C", name: "제주항공" },
  { code: "BX", name: "에어부산" },
  { code: "RS", name: "에어서울" },
];

const AIRPORTS = [
  { code: "ICN", name: "인천공항" },
  { code: "GMP", name: "김포공항" },
] as const;

type AirportCode = (typeof AIRPORTS)[number]["code"];

// 출발편은 출발 공항, 리턴편은 도착 공항이 사용자가 이용하는 국내 공항
const getInitialAirport = (flight?: TripFlight): AirportCode => {
  const code =
    flight?.flight_type === "return"
      ? flight.arrival_airport
      : flight?.departure_airport;
  return code === "GMP" ? "GMP" : "ICN";
};

interface AddFlightSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  startDate: string;
  endDate: string;
  defaultFlightType?: "departure" | "return";
  initialFlight?: TripFlight;
}

export default function AddFlightSheet({
  isOpen,
  onClose,
  tripId,
  startDate,
  endDate,
  defaultFlightType,
  initialFlight,
}: AddFlightSheetProps) {
  const isEditMode = !!initialFlight;
  const [flightId, setFlightId] = useState(initialFlight?.flight_id || "");
  const [flightType, setFlightType] = useState<"departure" | "return">(
    initialFlight?.flight_type || defaultFlightType || "departure",
  );
  const [airport, setAirport] = useState<AirportCode>(
    getInitialAirport(initialFlight),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFlight) {
      setFlightId(initialFlight.flight_id);
      setFlightType(initialFlight.flight_type);
      setAirport(getInitialAirport(initialFlight));
    } else if (defaultFlightType) {
      setFlightType(defaultFlightType);
    }
  }, [defaultFlightType, initialFlight]);

  const createFlight = useCreateFlight(tripId, isEditMode);

  const handleAirlineSelect = (code: string) => {
    setFlightId(code);
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        input.setSelectionRange(code.length, code.length);
      }
    }, 0);
  };

  const handleRegister = () => {
    if (!flightId.trim()) return;

    const flight: TripFlightInsert = {
      trip_id: tripId,
      flight_id: flightId.trim().toUpperCase(),
      airline: "",
      departure_airport: flightType === "departure" ? airport : "",
      arrival_airport: flightType === "departure" ? "" : airport,
      scheduled_date: flightType === "departure" ? startDate : endDate,
      scheduled_time: null,
      flight_type: flightType,
    };

    createFlight.mutate(flight, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setFlightId("");
    setFlightType("departure");
    setAirport("ICN");
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "항공편 수정" : "항공편 등록"}
      size="max"
      primaryButton={{
        text: isEditMode ? "수정하기" : "등록하기",
        onClick: handleRegister,
        isLoading: createFlight.isPending,
        disabled: !flightId.trim(),
      }}
    >
      <VStack px={4} pb={6} gap={5} align="stretch">
        {/* 출발/리턴 선택 */}
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            구분
          </Text>
          {isEditMode || defaultFlightType ? (
            <HStack gap={1.5} py={1}>
              {flightType === "departure" ? (
                <Plane size={16} color={colors.primary.hex[500]} />
              ) : (
                <PlaneLanding size={16} color={colors.primary.hex[500]} />
              )}
              <Text fontSize="md" fontWeight="semibold">
                {flightType === "departure" ? "출발편" : "리턴편"}
              </Text>
            </HStack>
          ) : (
            <SegmentGroup.Root
              size="md"
              w="full"
              value={flightType}
              onValueChange={(details) => {
                if (details.value) {
                  setFlightType(details.value as "departure" | "return");
                }
              }}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items
                w="full"
                items={[
                  {
                    value: "departure",
                    label: (
                      <HStack gap={1.5}>
                        <Plane
                          size={14}
                          color={
                            flightType === "departure"
                              ? colors.primary.hex[500]
                              : "currentColor"
                          }
                        />
                        <Text
                          fontWeight={
                            flightType === "departure" ? "semibold" : "normal"
                          }
                        >
                          출발편
                        </Text>
                      </HStack>
                    ),
                  },
                  {
                    value: "return",
                    label: (
                      <HStack gap={1.5}>
                        <PlaneLanding
                          size={14}
                          color={
                            flightType === "return"
                              ? colors.primary.hex[500]
                              : "currentColor"
                          }
                        />
                        <Text
                          fontWeight={
                            flightType === "return" ? "semibold" : "normal"
                          }
                          color={
                            flightType === "return"
                              ? colors.primary.hex[500]
                              : "currentColor"
                          }
                        >
                          리턴편
                        </Text>
                      </HStack>
                    ),
                  },
                ]}
              />
            </SegmentGroup.Root>
          )}
        </VStack>

        {/* 공항 선택 — 출발편은 출발 공항, 리턴편은 도착 공항 */}
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {flightType === "departure" ? "출발 공항" : "도착 공항"}
          </Text>
          <SegmentGroup.Root
            size="md"
            w="full"
            value={airport}
            onValueChange={(details) => {
              if (details.value) {
                setAirport(details.value as AirportCode);
              }
            }}
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items
              w="full"
              items={AIRPORTS.map((item) => ({
                value: item.code,
                label: (
                  <Text
                    fontWeight={airport === item.code ? "semibold" : "normal"}
                    color={
                      airport === item.code
                        ? colors.primary.hex[500]
                        : "currentColor"
                    }
                  >
                    {item.name}
                  </Text>
                ),
              }))}
            />
          </SegmentGroup.Root>
        </VStack>

        {/* 항공사 바로가기 */}
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            주요 항공사
          </Text>
          <Wrap gap={2}>
            {POPULAR_AIRLINES.map((airline) => (
              <Button
                key={airline.code}
                size="sm"
                variant={
                  flightId.startsWith(airline.code) ? "solid" : "outline"
                }
                colorPalette={
                  flightId.startsWith(airline.code)
                    ? colors.primary.palette
                    : "gray"
                }
                onClick={() => handleAirlineSelect(airline.code)}
              >
                <Text fontSize="xs">
                  {airline.name}({airline.code})
                </Text>
              </Button>
            ))}
          </Wrap>
        </VStack>

        {/* 편명 입력 */}
        <VStack align="stretch" gap={1}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            편명 (예: KE123, OZ101)
          </Text>
          <Input
            ref={inputRef}
            placeholder="편명을 입력하세요"
            value={flightId}
            onChange={(e) => setFlightId(e.target.value.trim().toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            size="md"
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            lang="en"
          />
          <Text fontSize="xs" color="gray.400">
            출발 당일에 실시간 운항 정보가 자동으로 표시됩니다.
          </Text>
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
