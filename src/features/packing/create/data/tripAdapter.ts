import dayjs from "dayjs";
import type { TablesInsert } from "@/shared/types/database.type";
import type { PackingCreateState } from "@/features/packing/create/store/packingCreateAtom";
import type { GeneratedCheckList } from "@/features/packing/create/hooks/useGenerateCheckList";

interface AdaptedTripData {
  tripData: TablesInsert<"trips">;
  checkListData: {
    categories: TablesInsert<"checklist_categories">[];
    items: TablesInsert<"checklist_items">[];
  };
}

export default class TripAdapter {
  private packingCreateState: PackingCreateState;
  private userId: string;

  constructor(packingCreateState: PackingCreateState, userId: string) {
    this.packingCreateState = packingCreateState;
    this.userId = userId;
  }

  private formatTripDates() {
    const startDate = this.packingCreateState.dates.startDate
      ? dayjs(this.packingCreateState.dates.startDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");

    const endDate = this.packingCreateState.dates.endDate
      ? dayjs(this.packingCreateState.dates.endDate).format("YYYY-MM-DD")
      : null;

    return { startDate, endDate };
  }

  private generateTripTitle(startDate: string): string {
    return this.packingCreateState.region
      ? `${this.packingCreateState.region.name} 여행 ${startDate}`
      : `여행 ${startDate}`;
  }

  private convertToTripData(): TablesInsert<"trips"> {
    const { startDate, endDate } = this.formatTripDates();
    const title = this.generateTripTitle(startDate);

    return {
      title,
      start_date: startDate,
      end_date: endDate,
      region_id: this.packingCreateState.region?.id || null,
      region_name: this.packingCreateState.region?.name || null,
      country_code: this.packingCreateState.region?.countryCode || null,
      companion_type: this.packingCreateState.companion || null,
      companion_types:
        this.packingCreateState.companionTypes.length > 0
          ? this.packingCreateState.companionTypes
          : null,
      trip_types:
        this.packingCreateState.tripTypes.length > 0
          ? this.packingCreateState.tripTypes
          : null,
      user_id: this.userId,
    };
  }

  private convertCheckListToDatabase(
    checkList: GeneratedCheckList[],
    tripId: string
  ) {
    const categories: TablesInsert<"checklist_categories">[] = [];
    const items: TablesInsert<"checklist_items">[] = [];

    checkList.forEach((category, categoryIndex) => {
      const categoryId = crypto.randomUUID();

      categories.push({
        id: categoryId,
        name: category.categoryName,
        display_order: categoryIndex + 1,
        trip_id: tripId,
      });

      category.items.forEach((item, itemIndex) => {
        items.push({
          name: item.name,
          is_required: item.required || false,
          is_checked: false,
          notes: item.notes || null,
          cabin_notes: item.cabinNotes || null,
          cabin_policy: item.cabin || null,
          display_order: itemIndex + 1,
          category_id: categoryId,
        });
      });
    });

    return { categories, items };
  }

  adaptTripData(): TablesInsert<"trips"> {
    return this.convertToTripData();
  }

  adaptCheckListData(checkList: GeneratedCheckList[], tripId: string) {
    return this.convertCheckListToDatabase(checkList, tripId);
  }

  adapt(checkList: GeneratedCheckList[], tripId: string): AdaptedTripData {
    return {
      tripData: this.convertToTripData(),
      checkListData: this.convertCheckListToDatabase(checkList, tripId),
    };
  }
}
