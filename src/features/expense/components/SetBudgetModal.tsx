import { useState, useEffect } from "react";
import { VStack, Input } from "@chakra-ui/react";
import Modal from "@/shared/components/Modal";

interface SetBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: number | null;
  onSave: (budget: number | null) => void;
}

export default function SetBudgetModal({
  isOpen,
  onClose,
  currentBudget,
  onSave,
}: SetBudgetModalProps) {
  const [inputBudget, setInputBudget] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputBudget(currentBudget ? currentBudget.toString() : "");
    }
  }, [isOpen, currentBudget]);

  const handleSave = () => {
    const newBudget = parseInt(inputBudget.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(newBudget)) {
      onSave(newBudget);
    } else {
      onSave(null);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="예산 설정"
      actions={[
        {
          label: "취소",
          onClick: onClose,
          variant: "surface",
          colorPalette: "gray",
        },
        {
          label: "저장",
          onClick: handleSave,
          variant: "solid",
        },
      ]}
    >
      <VStack align="stretch" gap={2}>
        <Input
          type="number"
          placeholder="1000000"
          value={inputBudget}
          onChange={(e) => setInputBudget(e.target.value)}
          size="lg"
          autoFocus
        />
      </VStack>
    </Modal>
  );
}
