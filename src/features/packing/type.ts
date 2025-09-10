import type { Database } from "@/shared/types/database.type";

export type ChecklistCategory =
  Database["public"]["Tables"]["checklist_categories"]["Row"];
export type ChecklistItem =
  Database["public"]["Tables"]["checklist_items"]["Row"];

export interface CategoryWithItems extends ChecklistCategory {
  items: ChecklistItem[];
}

export interface UseTripChecklistReturn {
  categories: CategoryWithItems[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseUpdateItemCheckedStatusParams {
  itemId: string;
  isChecked: boolean;
}

export interface TripWithProgress {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  region_name: string | null;
  total_items: number;
  checked_items: number;
  progress_percentage: number;
}

export interface UseCreateItemParams {
  categoryId: string;
  name: string;
  notes?: string;
}

export interface UseUpdateItemParams {
  itemId: string;
  name: string;
  notes?: string;
}

export interface UseCreateCategoryParams {
  tripId: string;
  categoryName: string;
  iconKey: string;
}
