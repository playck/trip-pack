import { useState } from "react";
import { SegmentGroup, Text, VStack } from "@chakra-ui/react";
import BottomSheet from "@/shared/components/BottomSheet";
import { colors } from "@/shared/constants/colors";
import ParkingStatusContent from "./ParkingStatusContent";
import type { ParkingAirport } from "../types";
import { PARKING_AIRPORT_NAMES } from "../types";

interface ParkingLookupSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIRPORTS: ParkingAirport[] = ["ICN", "GMP"];

// 여행 도우미용 조회 시트 — 항공편 맥락 없이 공항을 골라 오늘 기준 실시간 현황을 본다.
// 날짜를 넘기지 않으므로 예상 요금 박스 없이 실시간 현황 + 요금표만 노출된다.
export default function ParkingLookupSheet({
  isOpen,
  onClose,
}: ParkingLookupSheetProps) {
  const [airport, setAirport] = useState<ParkingAirport>("ICN");

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="공항 주차장 현황"
      size="max"
    >
      <VStack px={4} pb={2} gap={3} align="stretch">
        <SegmentGroup.Root
          size="md"
          w="full"
          value={airport}
          onValueChange={(details) => {
            if (details.value) setAirport(details.value as ParkingAirport);
          }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            w="full"
            items={AIRPORTS.map((code) => ({
              value: code,
              label: (
                <Text
                  fontWeight={airport === code ? "semibold" : "normal"}
                  color={
                    airport === code ? colors.primary.hex[500] : "currentColor"
                  }
                >
                  {PARKING_AIRPORT_NAMES[code]}
                </Text>
              ),
            }))}
          />
        </SegmentGroup.Root>

        <ParkingStatusContent airport={airport} />
      </VStack>
    </BottomSheet>
  );
}
