import type { Database } from "@/shared/types/database.type";

export type ShoppingCategory =
  Database["public"]["Tables"]["shopping_categories"]["Row"];
export type ShoppingItem =
  Database["public"]["Tables"]["shopping_items"]["Row"];

export interface ShoppingCategoryWithItems extends ShoppingCategory {
  items: ShoppingItem[];
}

export interface UseCreateShoppingItemParams {
  categoryId: string;
  name: string;
  notes?: string;
  price?: number;
  quantity?: number;
}

export interface UseUpdateShoppingItemParams {
  itemId: string;
  name: string;
  notes?: string;
  price?: number | null;
  quantity?: number | null;
}

export interface UseCreateShoppingCategoryParams {
  tripId: string;
  categoryName: string;
  iconKey: string;
}
