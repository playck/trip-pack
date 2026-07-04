import Modal from "@/shared/components/Modal";
import ParkingStatusContent from "./ParkingStatusContent";
import type { ParkingAirport } from "../types";
import { PARKING_AIRPORT_NAMES } from "../types";

interface ParkingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  airport?: ParkingAirport;
  tripStartDate?: string;
  tripDays?: number;
}

export default function ParkingStatusModal({
  isOpen,
  onClose,
  airport = "ICN",
  tripStartDate,
  tripDays,
}: ParkingStatusModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${PARKING_AIRPORT_NAMES[airport]} 주차장 현황`}
      size="md"
    >
      <ParkingStatusContent
        airport={airport}
        tripStartDate={tripStartDate}
        tripDays={tripDays}
      />
    </Modal>
  );
}
