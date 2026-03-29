import { useImperativeHandle, useState } from "react";
import type { Ref } from "react";
import { Text, Box, HStack } from "@chakra-ui/react";
import { ClipboardList } from "lucide-react";

import { AddCategorySheet, Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";
import TodoGridView from "@/features/todo/list/components/TodoGridView";
import TodoListView from "@/features/todo/list/components/TodoListView";
import {
  useTodoChecklist,
  useUpdateTodoItemChecked,
} from "@/features/todo/list/hooks/useTodoChecklist";
import { useCreateTodoCategory } from "@/features/todo/list/hooks/useTodoMutations";
import { useTodoListViewControls } from "@/features/todo/list/hooks/useTodoListViewControls";
import { useTripMembers } from "@/features/trip-members/hooks/useTripMembers";

import type { SectionHandle } from "./PackingSection";

interface TodoSectionProps {
  ref?: Ref<SectionHandle>;
  tripId: string;
  viewMode: string;
  showUncheckedOnly: boolean;
  categorySheet: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}

export default function TodoSection({
  ref,
  tripId,
  viewMode,
  showUncheckedOnly,
  categorySheet,
}: TodoSectionProps) {
  const { categories, progress } = useTodoChecklist(tripId);
  const listControls = useTodoListViewControls(categories);
  const updateItemStatus = useUpdateTodoItemChecked(tripId);
  const createCategoryMutation = useCreateTodoCategory(tripId, {
    onSuccess: () => categorySheet.onClose(),
  });

  const { user } = useAuth();
  const { data: tripMembers = [] } = useTripMembers(tripId);
  const currentMemberId = tripMembers.find(
    (m) => m.user_id === user?.id,
  )?.id;
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleAllCategories: listControls.toggleAllCategories,
  }));

  if (categories.length === 0) return null;

  return (
    <>
      <HStack gap={2} align="center" mt={4} mb={2}>
        <Box flex={1} h="1px" bg="gray.300" />
        <HStack gap={1.5}>
          <ClipboardList size={16} color={colors.primary.hex[500]} />
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            할일
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

      {viewMode === "일렬형식" && tripMembers.length > 1 && (
        <HStack justify="flex-end">
          <Checkbox
            isChecked={showOnlyMine}
            onChange={() => setShowOnlyMine((prev) => !prev)}
            label="내 할일만 보기"
            size="md"
          />
        </HStack>
      )}

      {viewMode === "그리드" ? (
        <TodoGridView categories={categories} tripId={tripId} />
      ) : (
        <TodoListView
          categories={categories}
          tripId={tripId}
          onToggleItem={(itemId, isChecked) =>
            updateItemStatus.mutate({ itemId, isChecked })
          }
          showUncheckedOnly={showUncheckedOnly}
          showOnlyMine={showOnlyMine}
          currentMemberId={currentMemberId}
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
