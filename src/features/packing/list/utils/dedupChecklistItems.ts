import type { ParsedCategory } from "./parseChecklistText";

/** 카테고리별로 동일 name 아이템을 제거 (먼저 추가된 아이템을 유지) */
export function dedupWithinCategories(
  categories: ParsedCategory[],
): ParsedCategory[] {
  return categories
    .map((cat) => {
      const seen = new Set<string>();
      return {
        ...cat,
        items: cat.items.filter((item) => {
          if (seen.has(item.name)) return false;
          seen.add(item.name);
          return true;
        }),
      };
    })
    .filter((cat) => cat.items.length > 0);
}
