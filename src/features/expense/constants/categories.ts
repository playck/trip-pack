import {
  Utensils,
  Coffee,
  ShoppingBag,
  Bus,
  Camera,
  BedDouble,
  Plane,
  Ticket,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export type ExpenseCategoryId =
  | "food"
  | "cafe"
  | "shopping"
  | "transport"
  | "tour"
  | "lodging"
  | "flight"
  | "ticket"
  | "etc";

export interface ExpenseCategoryDef {
  id: ExpenseCategoryId;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  { id: "food", label: "식비", icon: Utensils, color: "orange" },
  { id: "cafe", label: "카페", icon: Coffee, color: "yellow" },
  { id: "shopping", label: "쇼핑", icon: ShoppingBag, color: "pink" },
  { id: "transport", label: "교통", icon: Bus, color: "blue" },
  { id: "tour", label: "관광", icon: Camera, color: "teal" },
  { id: "lodging", label: "숙박", icon: BedDouble, color: "purple" },
  { id: "flight", label: "항공", icon: Plane, color: "cyan" },
  { id: "ticket", label: "티켓", icon: Ticket, color: "red" },
  { id: "etc", label: "기타", icon: MoreHorizontal, color: "gray" },
];

const labelMap = new Map(EXPENSE_CATEGORIES.map((c) => [c.label, c]));

export function findCategoryByLabel(
  label?: string | null,
): ExpenseCategoryDef | undefined {
  if (!label) return undefined;
  return labelMap.get(label);
}
