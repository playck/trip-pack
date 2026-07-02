import { useState } from "react";
import { Button, Timeline } from "@chakra-ui/react";
import { SquareParking, ChevronRight } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import { ParkingStatusModal } from "@/features/airport-parking/components";

// 일정표 출발편 아래 전폭 트리거. 누를 때만 모달을 열어 데이터를 조회한다.
export default function ParkingScheduleItem() {
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
          인천공항 주차장 현황 보기
          <ChevronRight size={15} />
        </Button>

        <ParkingStatusModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Timeline.Content>
    </Timeline.Item>
  );
}
