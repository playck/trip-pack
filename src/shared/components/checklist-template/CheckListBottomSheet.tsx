import { useState } from "react";
import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import type { CategoryWithItems } from "@/features/packing/type";
import { backgrounds, borderColors, colors } from "@/shared/constants/colors";
import { useCreateCategoriesFromCheckList } from "@/features/packing/list/hooks/useCreateCategoriesFromCheckList";
import CheckList from "./CheckList";
import BottomSheet from "../BottomSheet";

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
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={title}>
      <Flex flexDirection="column" h="100%" minHeight="65vh">
        <Box px={4} py={4} flex={1} overflowY="auto">
          <CheckList
            categories={categories}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        </Box>
        <Box
          w="full"
          position="sticky"
          bottom={0}
          left={0}
          right={0}
          p={4}
          mt={2}
          bg={backgrounds.primary}
          borderTop="1px"
          borderColor={borderColors.default}
        >
          <HStack gap={3}>
            <Button
              flex={1}
              variant="outline"
              size="lg"
              borderRadius="xl"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              flex={1}
              colorPalette={colors.primary.palette}
              variant="solid"
              size="lg"
              borderRadius="xl"
              onClick={handleAddCategories}
              disabled={selectedIds.size === 0 || createCategories.isPending}
              loading={createCategories.isPending}
            >
              추가 {selectedIds.size > 0 && `(${selectedIds.size})`}
            </Button>
          </HStack>
        </Box>
      </Flex>
    </BottomSheet>
  );
}
