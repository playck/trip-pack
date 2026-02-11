import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import type { CategoryWithItems } from "@/features/packing/type";
import { useCreateCategoriesFromCheckList } from "@/features/packing/list/hooks/useCreateCategoriesFromCheckList";
import { BottomSheet } from "@/shared/components";
import CheckList from "./CheckList";

interface CheckListBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  categories: CategoryWithItems[];
  tripId: string;
}

export default function CheckListBottomSheet({
  isOpen,
  onClose,
  title,
  categories,
  tripId,
}: CheckListBottomSheetProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const createCategories = useCreateCategoriesFromCheckList(tripId, {
    onSuccess: () => {
      onClose();
      setSelectedIds(new Set());
    },
  });

  const handleAddCategories = () => {
    const selectedCategories = categories.filter((cat) =>
      selectedIds.has(cat.id)
    );

    if (selectedCategories.length === 0) return;

    createCategories.mutate(selectedCategories);
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      adjustForKeyboard={false}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
      primaryButton={{
        text: `추가${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`,
        onClick: handleAddCategories,
        disabled: selectedIds.size === 0 || createCategories.isPending,
        isLoading: createCategories.isPending,
      }}
    >
      <Flex flexDirection="column" h="100%" minHeight="70vh">
        <Box px={4} py={4} flex={1} overflowY="auto">
          <CheckList
            categories={categories}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </Box>
      </Flex>
    </BottomSheet>
  );
}
