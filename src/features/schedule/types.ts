import type { Tables, TablesInsert } from "@/shared/types/database.type";

export type Schedule = Tables<"trip_schedules">;
export type ScheduleInsert = TablesInsert<"trip_schedules">;

export interface CreateScheduleParams {
  tripId: string;
  dayNumber: number;
  scheduleDate: string;
  placeId: string;
  placeName: string;
  placeAddress?: string;
  latitude?: number;
  longitude?: number;
  visitOrder: number;
  startTime?: string;
  notes?: string;
  category?: string;
}

export interface UpdateScheduleParams {
  scheduleId: string;
  placeName?: string;
  placeAddress?: string;
  startTime?: string | null;
  notes?: string | null;
}
