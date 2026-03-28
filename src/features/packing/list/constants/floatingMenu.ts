import {
  Save,
  Download,
  FolderPlus,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FloatingMenuConfig {
  label: string;
  icon: LucideIcon;
  sheetKey: "save" | "template" | "category" | "shoppingCategory" | "todoCategory";
  group?: string;
  groupLabel?: string;
}

export const FLOATING_MENU_CONFIG: FloatingMenuConfig[] = [
  { label: "체크리스트 저장", icon: Save, sheetKey: "save" },
  { label: "체크리스트 가져오기", icon: Download, sheetKey: "template" },
  { label: "준비물", icon: FolderPlus, sheetKey: "category", group: "category", groupLabel: "카테고리 추가" },
  { label: "쇼핑", icon: ShoppingCart, sheetKey: "shoppingCategory", group: "category" },
  { label: "할일", icon: ClipboardList, sheetKey: "todoCategory", group: "category" },
];
