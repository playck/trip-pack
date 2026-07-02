import Modal from "@/shared/components/Modal";
import ParkingStatusContent from "./ParkingStatusContent";

interface ParkingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 인천공항 주차장 현황 상세 모달. 일정 트리거·(향후) 메인 위젯이 공용으로 사용.
export default function ParkingStatusModal({
  isOpen,
  onClose,
}: ParkingStatusModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="인천공항 주차장 현황"
      size="md"
    >
      <ParkingStatusContent />
    </Modal>
  );
}
