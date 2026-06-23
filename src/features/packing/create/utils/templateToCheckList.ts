import type { TemplateCategoryWithItems } from "@/features/packing/type";
import type { GeneratedCheckList } from "../hooks/useGenerateCheckList";

/**
 * 저장된 체크리스트 템플릿을 여행 생성용 GeneratedCheckList 형식으로 변환한다.
 * "내 체크리스트로 시작"(깔끔 모드)에서 사용 — 지역/계절 기반 자동 추천은 섞지 않고
 * 사용자가 저장해 둔 카테고리/아이템을 그대로 옮긴다.
 */
export function templateToCheckList(
  categories: TemplateCategoryWithItems[],
): GeneratedCheckList[] {
  return [...categories]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((category) => ({
      categoryName: category.name,
      items: [...(category.template_items ?? [])]
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((item) => ({
          name: item.name,
          required: item.is_required ?? false,
          notes: item.notes ?? undefined,
        })),
    }));
}
