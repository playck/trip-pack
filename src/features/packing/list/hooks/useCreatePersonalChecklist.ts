import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { useTripInfo } from "@/shared/service/trip/useTripQuery";
import { generateCheckList } from "@/features/packing/create/utils/generateCheckList";
import { getRegionById } from "@/shared/data/regions";
import type { PackingCreateState } from "@/features/packing/create/store/packingCreateAtom";
import type { PackingStyle } from "@/shared/data/checkList";
import type {
  CompanionTypeOption,
  TripTypeOption,
} from "@/features/packing/create/data/data";

import { createCategoriesFromCheckList } from "../services/api";
import type { CategoryWithItems } from "../../type";
import type { ChecklistItem } from "../../type";

/**
 * 여행에 나중에 합류한 멤버가 자기 체크리스트를 자동 생성하는 경로.
 *
 * `packingStyle` 은 마법사 경로와 **같은 값**이 들어와야 한다. 서로 다르면
 * 같은 사용자가 경로에 따라 다른 체크리스트를 받는다 — 이 기능이 고치려던
 * 문제가 그대로 재발한다. 성향 저장(`profiles.packing_style`)이 붙기 전까지는
 * 기본값 `"full"` 로 현재 동작을 유지한다.
 */
export function useCreatePersonalChecklist(
  tripId: string,
  packingStyle: PackingStyle = "full"
) {
  const queryClient = useQueryClient();
  const { data: tripInfo } = useTripInfo(tripId);

  return useMutation({
    mutationFn: async () => {
      if (!tripInfo) {
        throw new Error("여행 정보를 불러올 수 없어요.");
      }

      const region = tripInfo.regionId ? getRegionById(tripInfo.regionId) : null;

      const state: PackingCreateState = {
        region: region ?? null,
        dates: {
          startDate: tripInfo.startDate ? new Date(tripInfo.startDate) : null,
          endDate: tripInfo.endDate ? new Date(tripInfo.endDate) : null,
        },
        companion: null,
        companionTypes: (tripInfo.companionTypes ?? []) as CompanionTypeOption[],
        tripTypes: (tripInfo.tripTypes ?? []) as TripTypeOption[],
        startMode: "auto",
      };

      const generated = generateCheckList(state, packingStyle);

      // DB 형식으로 변환 (createCategoriesFromCheckList가 받는 모양)
      const categories = generated.map<
        CategoryWithItems & { category_type: "packing" }
      >((c) => ({
        id: "",
        name: c.categoryName,
        trip_id: tripId,
        icon_key: null,
        display_order: null,
        created_at: null,
        created_by: "",
        category_type: "packing",
        items: c.items.map(
          (item) =>
            ({
              id: "",
              category_id: "",
              name: item.name,
              notes: item.notes ?? null,
              is_required: item.required ?? false,
              is_checked: false,
              cabin_policy: item.cabin ?? "allowed",
              cabin_notes: item.cabinNotes ?? null,
              display_order: null,
              created_at: null,
              updated_at: null,
            }) satisfies ChecklistItem,
        ),
      }));

      return createCategoriesFromCheckList(tripId, categories);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["tripChecklist", tripId] });
      if (result.successCount > 0) {
        toaster.create({
          title: "내 짐 체크리스트가 만들어졌어요",
          type: "success",
          duration: 2000,
        });
      } else {
        toaster.create({
          title: "생성된 카테고리가 없어요",
          description: "여행 정보를 확인해주세요.",
          type: "warning",
          duration: 3000,
        });
      }
    },
    onError: (error: Error) => {
      toaster.create({
        title: "체크리스트 생성 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    },
  });
}
