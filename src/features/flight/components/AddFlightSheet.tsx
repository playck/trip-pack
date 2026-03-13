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
  { code: "4V", name: "에어로케이" },
];

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFlight) {
      setFlightId(initialFlight.flight_id);
      setFlightType(initialFlight.flight_type);
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
      departure_airport: flightType === "departure" ? "ICN" : "",
      arrival_airport: flightType === "departure" ? "" : "ICN",
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
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "항공편 수정" : "항공편 등록"}
      minHeight="85vh"
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
          <SegmentGroup.Root
            size="md"
            w="full"
            value={flightType}
            onValueChange={(details) => {
              if (details.value && !isEditMode && !defaultFlightType) {
                setFlightType(details.value as "departure" | "return");
              }
            }}
            css={
              isEditMode || defaultFlightType
                ? { pointerEvents: "none" }
                : undefined
            }
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
                        fontWeight={flightType === "departure" ? "semibold" : "normal"}
                        color={flightType === "departure" ? colors.primary.hex[500] : "currentColor"}
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
                        fontWeight={flightType === "return" ? "semibold" : "normal"}
                        color={flightType === "return" ? colors.primary.hex[500] : "currentColor"}
                      >
                        리턴편
                      </Text>
                    </HStack>
                  ),
                },
              ]}
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
