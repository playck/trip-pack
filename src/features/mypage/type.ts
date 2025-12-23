export type DialogType = "logout" | "delete" | null;

export interface DialogConfig {
  isOpen: boolean;
  type: DialogType;
}
