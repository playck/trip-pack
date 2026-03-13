import { useState } from "react";
import { VStack, Button, HStack, Text, StackSeparator } from "@chakra-ui/react";
import { Edit2, Trash2 } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import { ConfirmDialog } from "@/shared/components";
import { borderColors, statusColors } from "@/shared/constants/colors";

interface FlightActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  flightName: string;
}

export default function FlightActionSheet({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  flightName,
}: FlightActionSheetProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={flightName}>
        <VStack p={3} pt={0} align="stretch" gap={0}>
          <VStack
            gap={0}
            align="stretch"
            separator={<StackSeparator borderColor={borderColors.default} />}
          >
            <Button
              variant="ghost"
              size="lg"
              justifyContent="flex-start"
              color="gray.700"
              fontWeight="medium"
              h="56px"
              px={2}
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              <HStack gap={3}>
                <Edit2 size={20} />
                <Text>수정하기</Text>
              </HStack>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              justifyContent="flex-start"
              color={statusColors.error.text}
              fontWeight="medium"
              h="56px"
              px={2}
              onClick={() => {
                onClose();
                setIsDeleteConfirmOpen(true);
              }}
            >
              <HStack gap={3}>
                <Trash2 size={20} />
                <Text>삭제하기</Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </BottomSheet>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="항공편 삭제"
        message={`${flightName}을(를) 삭제하시겠습니까?`}
        confirmLabel="삭제"
        isDangerous
        onConfirm={() => {
          onDelete();
          setIsDeleteConfirmOpen(false);
        }}
      />
    </>
  );
}
