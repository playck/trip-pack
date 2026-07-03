import { useState } from "react";
import { Button, Timeline } from "@chakra-ui/react";
import { SquareParking, ChevronRight } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import { ParkingStatusModal } from "@/features/airport-parking/components";
import type { ParkingAirport } from "@/features/airport-parking/types";
import { PARKING_AIRPORT_NAMES } from "@/features/airport-parking/types";

interface ParkingScheduleItemProps {
  airport?: ParkingAirport;
}

export default function ParkingScheduleItem({
  airport = "ICN",
}: ParkingScheduleItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Timeline.Item>
      <Timeline.Connector>
        <Timeline.Separator />
        <Timeline.Indicator bg="white">
          <SquareParking size={14} />
        </Timeline.Indicator>
      </Timeline.Connector>
      <Timeline.Content width="full" ml={-2} pb="16px">
        <Button
          w="full"
          size="sm"
          variant="ghost"
          px={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor={colors.primary.muted}
          color={colors.primary.fg}
          fontWeight="semibold"
          justifyContent="space-between"
          onClick={() => setIsOpen(true)}
          _hover={{ bg: colors.primary.subtle }}
          _active={{ bg: colors.primary.subtle }}
        >
          {PARKING_AIRPORT_NAMES[airport]} 주차장 현황 보기
          <ChevronRight size={15} />
        </Button>

        <ParkingStatusModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          airport={airport}
        />
      </Timeline.Content>
    </Timeline.Item>
  );
}
