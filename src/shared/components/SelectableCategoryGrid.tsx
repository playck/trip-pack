import { SimpleGrid, HStack, Text } from "@chakra-ui/react";
import { Checkbox } from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import SelectableCategoryBox from "./SelectableCategoryBox";

export interface BaseCategoryWithItems {
  id: string;
  name: string;
  icon_key: string | null;
  display_order?: number | null;
}

interface SelectableCategoryGridProps<
  T extends BaseCategoryWithItems = BaseCategoryWithItems,
> {
  categories: T[];
  selectedIds: Set<string>;
  onToggle: (categoryId: string) => void;
  showSelectAll?: boolean;
  onSelectAll?: () => void;
  selectLabel?: string;
  isDisabled?: (category: T) => boolean;
  subText?: (category: T) => string | undefined;
  columns?: number;
}

export default function SelectableCategoryGrid<
  T extends BaseCategoryWithItems = BaseCategoryWithItems,
>({
  categories,
  selectedIds,
  onToggle,
  showSelectAll = false,
  onSelectAll,
  selectLabel,
  isDisabled,
  subText,
  columns = 3,
}: SelectableCategoryGridProps<T>) {
  const isAllSelected =
    categories.length > 0 &&
    categories.filter((c) => !isDisabled?.(c)).length > 0 &&
    selectedIds.size === categories.filter((c) => !isDisabled?.(c)).length;

  return (
    <>
      {showSelectAll && onSelectAll && (
        <HStack justify="space-between" align="center" px={1} mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            {selectLabel}
          </Text>
          <Checkbox
            isChecked={isAllSelected}
            onChange={onSelectAll}
            label="전체 선택"
            colorScheme={colors.primary.palette}
          />
        </HStack>
      )}

      <SimpleGrid columns={columns} gap={4} w="full">
        {categories.map((category) => {
          const disabled = isDisabled?.(category) ?? false;

          return (
            <SelectableCategoryBox
              key={category.id}
              name={category.name}
              iconKey={category.icon_key ?? undefined}
              isSelected={selectedIds.has(category.id)}
              isDisabled={disabled}
              subText={subText?.(category)}
              onClick={() => onToggle(category.id)}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}
