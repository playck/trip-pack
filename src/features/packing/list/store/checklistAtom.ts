import { atom } from "jotai";
import type { GeneratedCheckList } from "../../create/hooks/useGenerateCheckList";

export const checkedItemsAtom = atom<Record<string, boolean>>({});
export const categoryItemsAtom = atom<Record<string, GeneratedCheckList>>({});

export const toggleItemAtom = atom(
  null,
  (
    get,
    set,
    { categoryName, itemName }: { categoryName: string; itemName: string }
  ) => {
    const currentChecked = get(checkedItemsAtom);
    const key = `${categoryName}-${itemName}`;

    set(checkedItemsAtom, {
      ...currentChecked,
      [key]: !currentChecked[key],
    });
  }
);

export const getCategoryCheckedCountAtom = atom(
  (get) => (categoryName: string) => {
    const checkedItems = get(checkedItemsAtom);
    const categoryCheckedCount = Object.keys(checkedItems).filter(
      (key) => key.startsWith(`${categoryName}-`) && checkedItems[key]
    ).length;

    return categoryCheckedCount;
  }
);

export const getCategoryProgressAtom = atom((get) => (categoryName: string) => {
  const checkedItems = get(checkedItemsAtom);
  const categoryItems = get(categoryItemsAtom);
  const category = categoryItems[categoryName];

  if (!category) return 0;

  const categoryCheckedCount = Object.keys(checkedItems).filter(
    (key) => key.startsWith(`${categoryName}-`) && checkedItems[key]
  ).length;

  const totalItems = category.items.length;

  return totalItems > 0
    ? Math.round((categoryCheckedCount / totalItems) * 100)
    : 0;
});

export const updateItemAtom = atom(
  null,
  (
    get,
    set,
    {
      categoryName,
      oldItemName,
      updatedItem,
    }: {
      categoryName: string;
      oldItemName: string;
      updatedItem: { name: string; notes?: string };
    }
  ) => {
    const currentCategories = get(categoryItemsAtom);
    const currentChecked = get(checkedItemsAtom);
    const oldKey = `${categoryName}-${oldItemName}`;
    const newKey = `${categoryName}-${updatedItem.name}`;

    // 카테고리 아이템에서 이름과 notes 업데이트
    const category = currentCategories[categoryName];
    if (category) {
      const updatedItems = category.items.map((item) =>
        item.name === oldItemName
          ? { ...item, name: updatedItem.name, notes: updatedItem.notes }
          : item
      );

      set(categoryItemsAtom, {
        ...currentCategories,
        [categoryName]: {
          ...category,
          items: updatedItems,
        },
      });
    }

    // 이름이 변경된 경우에만 체크 상태 키 변경
    if (oldItemName !== updatedItem.name) {
      const updatedChecked = { ...currentChecked };
      if (updatedChecked[oldKey] !== undefined) {
        updatedChecked[newKey] = updatedChecked[oldKey];
        delete updatedChecked[oldKey];
      }
      set(checkedItemsAtom, updatedChecked);
    }
  }
);

export const updateItemNameAtom = atom(
  null,
  (
    get,
    set,
    {
      categoryName,
      oldItemName,
      newItemName,
    }: {
      categoryName: string;
      oldItemName: string;
      newItemName: string;
    }
  ) => {
    set(updateItemAtom, {
      categoryName,
      oldItemName,
      updatedItem: { name: newItemName },
    });
  }
);

export const initializeCategoryAtom = atom(
  null,
  (get, set, category: GeneratedCheckList) => {
    const currentCategories = get(categoryItemsAtom);
    set(categoryItemsAtom, {
      ...currentCategories,
      [category.categoryName]: category,
    });
  }
);

export const deleteItemAtom = atom(
  null,
  (
    get,
    set,
    { categoryName, itemName }: { categoryName: string; itemName: string }
  ) => {
    const currentCategories = get(categoryItemsAtom);
    const currentChecked = get(checkedItemsAtom);
    const key = `${categoryName}-${itemName}`;

    // 해당 카테고리에서 아이템 실제 제거
    const category = currentCategories[categoryName];
    if (category) {
      const updatedItems = category.items.filter(
        (item) => item.name !== itemName
      );
      set(categoryItemsAtom, {
        ...currentCategories,
        [categoryName]: {
          ...category,
          items: updatedItems,
        },
      });
    }

    // 체크된 아이템에서도 제거
    const updatedChecked = { ...currentChecked };
    delete updatedChecked[key];
    set(checkedItemsAtom, updatedChecked);
  }
);
