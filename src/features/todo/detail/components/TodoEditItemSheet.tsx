import { VStack, Text, Input, Textarea, HStack, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import { BottomSheet } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useUpdateTodoItem } from "../../list/hooks/useTodoMutations";
import type { TodoItemWithAssignees } from "../../type";
import type { TripMemberWithProfile } from "@/features/trip-members/services/api";

interface TodoEditItemSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: TodoItemWithAssignees;
  tripId?: string;
  members: TripMemberWithProfile[];
}

export default function TodoEditItemSheet({
  isOpen,
  onClose,
  item,
  tripId,
  members,
}: TodoEditItemSheetProps) {
  const [itemName, setItemName] = useState(item.name);
  const [itemNotes, setItemNotes] = useState(item.notes || "");
  const [itemDueDate, setItemDueDate] = useState(item.due_date || "");
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
    item.assignees.map((a) => a.member_id)
  );

  const updateItemMutation = useUpdateTodoItem(tripId, {
    onSuccess: () => onClose(),
  });

  const handleAssigneeToggle = (memberId: string) => {
    setSelectedAssigneeIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleItemSave = () => {
    if (!itemName.trim()) {
      toaster.create({
        title: "입력 오류",
        description: "할일 이름을 입력해주세요.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!item.id) {
      toaster.create({
        title: "오류가 발생했습니다",
        description: "할일 정보를 찾을 수 없습니다.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    updateItemMutation.mutate({
      itemId: item.id,
      name: itemName.trim(),
      notes: itemNotes.trim() || undefined,
      dueDate: itemDueDate || null,
      assigneeIds: selectedAssigneeIds,
    });
  };

  const handleCancel = () => {
    setItemName(item.name);
    setItemNotes(item.notes || "");
    setItemDueDate(item.due_date || "");
    setSelectedAssigneeIds(item.assignees.map((a) => a.member_id));
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setItemName(item.name);
      setItemNotes(item.notes || "");
      setItemDueDate(item.due_date || "");
      setSelectedAssigneeIds(item.assignees.map((a) => a.member_id));
    }
  }, [isOpen, item.name, item.notes, item.due_date, item.assignees]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleCancel}
      title="수정하기"
      primaryButton={{
        onClick: handleItemSave,
        disabled: !itemName.trim() || updateItemMutation.isPending,
        isLoading: updateItemMutation.isPending,
      }}
      secondaryButton={{
        onClick: handleCancel,
        disabled: updateItemMutation.isPending,
      }}
    >
      <VStack gap={4} p={3} w="full" align="stretch">
        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            할일 이름
          </Text>
          <Input
            value={itemName}
            placeholder="할일 이름을 입력 해 주세요"
            size="md"
            borderRadius="md"
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemName(e.target.value)}
          />
        </VStack>

        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            마감일
          </Text>
          <Input
            type="date"
            value={itemDueDate}
            size="md"
            borderRadius="md"
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemDueDate(e.target.value)}
          />
        </VStack>

        {members.length > 0 && (
          <VStack gap={2} align="stretch">
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              담당자
            </Text>
            <HStack gap={2} flexWrap="wrap">
              {members.map((member) => {
                const isSelected = selectedAssigneeIds.includes(member.id);
                return (
                  <Box
                    key={member.id}
                    as="button"
                    px={3}
                    py={1.5}
                    bg={isSelected ? `${colors.primary.palette}.500` : "gray.100"}
                    color={isSelected ? "white" : "gray.600"}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => handleAssigneeToggle(member.id)}
                  >
                    {member.profiles?.username || member.profiles?.email || "알 수 없음"}
                  </Box>
                );
              })}
            </HStack>
          </VStack>
        )}

        <VStack gap={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            메모
          </Text>
          <Textarea
            value={itemNotes}
            placeholder="할일에 대한 메모를 입력 해 주세요"
            size="md"
            borderRadius="md"
            rows={3}
            maxLength={200}
            resize="none"
            _focus={{
              borderColor: colors.primary.solid,
              boxShadow: colors.primary.focusRing,
            }}
            onChange={(e) => setItemNotes(e.target.value)}
          />
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
