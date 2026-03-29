import { useImperativeHandle } from "react";
import type { Ref } from "react";
import { Text, Box, HStack } from "@chakra-ui/react";
import { ShoppingCart } from "lucide-react";

import { AddCategorySheet } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import ShoppingGridView from "@/features/shopping/list/components/ShoppingGridView";
import ShoppingListView from "@/features/shopping/list/components/ShoppingListView";
import {
  useShoppingChecklist,
  useUpdateShoppingItemChecked,
} from "@/features/shopping/list/hooks/useShoppingChecklist";
import { useCreateShoppingCategory } from "@/features/shopping/list/hooks/useShoppingMutations";
import { useShoppingListViewControls } from "@/features/shopping/list/hooks/useShoppingListViewControls";

import type { SectionHandle } from "./PackingSection";

interface ShoppingSectionProps {
  ref?: Ref<SectionHandle>;
  tripId: string;
  viewMode: string;
  showUncheckedOnly: boolean;
  categorySheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}

export default function ShoppingSection({
  ref,
  tripId,
  viewMode,
  showUncheckedOnly,
  categorySheet,
}: ShoppingSectionProps) {
  const { categories, progress } = useShoppingChecklist(tripId);
  const listControls = useShoppingListViewControls(categories);
  const updateItemStatus = useUpdateShoppingItemChecked(tripId);
  const createCategoryMutation = useCreateShoppingCategory(tripId, {
    onSuccess: () => categorySheet.onClose(),
  });

  useImperativeHandle(ref, () => ({
    toggleAllCategories: listControls.toggleAllCategories,
  }));

  if (categories.length === 0) return null;

  return (
    <>
      <HStack gap={2} align="center" mt={4} mb={2}>
        <Box flex={1} h="1px" bg="gray.300" />
        <HStack gap={1.5}>
          <ShoppingCart size={16} color={colors.primary.hex[500]} />
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            쇼핑
          </Text>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color={colors.primary.fg}
          >
            {progress.checkedItems}/{progress.totalItems}
          </Text>
        </HStack>
        <Box flex={1} h="1px" bg="gray.300" />
      </HStack>

      {viewMode === "그리드" ? (
        <ShoppingGridView categories={categories} tripId={tripId} />
      ) : (
        <ShoppingListView
          categories={categories}
          tripId={tripId}
          onToggleItem={(itemId, isChecked) =>
            updateItemStatus.mutate({ itemId, isChecked })
          }
          showUncheckedOnly={showUncheckedOnly}
          expandedCategories={listControls.expandedCategories}
          toggleCategory={listControls.toggleCategory}
        />
      )}

      <AddCategorySheet
        isOpen={categorySheet.isOpen}
        isLoading={createCategoryMutation.isPending}
        showSharedToggle
        onSave={(categoryName, iconKey, isShared) =>
          createCategoryMutation.mutate({ categoryName, iconKey, isShared })
        }
        onClose={categorySheet.onClose}
      />
    </>
  );
}
