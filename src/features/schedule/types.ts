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

export interface SelectedDay {
  dayNumber: number;
  date: string;
}

export interface UpdateScheduleParams {
  scheduleId: string;
  placeName?: string;
  placeAddress?: string;
  latitude?: number;
  longitude?: number;
  startTime?: string;
  durationMinutes?: number;
  notes?: string;
  category?: string;
}

export type Wishlist = Tables<"trip_wishlists">;
export type WishlistInsert = TablesInsert<"trip_wishlists">;

export interface CreateWishlistParams {
  tripId: string;
  placeId: string;
  placeName: string;
  placeAddress?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  category?: string;
}

export interface UpdateWishlistParams {
  wishlistId: string;
  placeName?: string;
  notes?: string;
  category?: string;
}
