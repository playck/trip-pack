import { atom } from "jotai";

// 체크된 아이템들을 저장하는 atom
export const checkedItemsAtom = atom<Record<string, boolean>>({});

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

export const getCategoryProgressAtom = atom(
  (get) => (categoryName: string, totalItems: number) => {
    const checkedItems = get(checkedItemsAtom);
    const categoryCheckedCount = Object.keys(checkedItems).filter(
      (key) => key.startsWith(`${categoryName}-`) && checkedItems[key]
    ).length;

    return totalItems > 0
      ? Math.round((categoryCheckedCount / totalItems) * 100)
      : 0;
  }
);
