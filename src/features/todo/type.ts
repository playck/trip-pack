import type { Database } from "@/shared/types/database.type";

export type TodoCategory =
  Database["public"]["Tables"]["todo_categories"]["Row"];
export type TodoItem = Database["public"]["Tables"]["todo_items"]["Row"];
export type TodoItemAssignee =
  Database["public"]["Tables"]["todo_item_assignees"]["Row"];

export interface TodoItemWithAssignees extends TodoItem {
  assignees: { member_id: string; username: string | null }[];
}

export interface TodoCategoryWithItems extends TodoCategory {
  items: TodoItemWithAssignees[];
}

export interface UseCreateTodoItemParams {
  categoryId: string;
  name: string;
  notes?: string;
  dueDate?: string;
  assigneeIds?: string[];
}

export interface UseUpdateTodoItemParams {
  itemId: string;
  name: string;
  notes?: string;
  dueDate?: string | null;
  assigneeIds?: string[];
}

export interface UseCreateTodoCategoryParams {
  tripId: string;
  categoryName: string;
  iconKey: string;
  isShared?: boolean;
}
