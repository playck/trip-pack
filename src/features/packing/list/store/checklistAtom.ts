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
    const currentCategories = get(categoryItemsAtom);
    const currentChecked = get(checkedItemsAtom);
    const oldKey = `${categoryName}-${oldItemName}`;
    const newKey = `${categoryName}-${newItemName}`;

    // 카테고리 아이템에서 이름 업데이트
    const category = currentCategories[categoryName];
    if (category) {
      const updatedItems = category.items.map((item) =>
        item.name === oldItemName ? { ...item, name: newItemName } : item
      );

      set(categoryItemsAtom, {
        ...currentCategories,
        [categoryName]: {
          ...category,
          items: updatedItems,
        },
      });
    }

    // 기존 키에서 새 키로 체크 상태 이동
    const updatedChecked = { ...currentChecked };
    if (updatedChecked[oldKey] !== undefined) {
      updatedChecked[newKey] = updatedChecked[oldKey];
      delete updatedChecked[oldKey];
    }

    set(checkedItemsAtom, updatedChecked);
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
