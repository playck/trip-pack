import { triggerHaptic } from "@/shared/utils/nativeMessage";

type HapticStyle = "light" | "medium" | "heavy" | "success" | "warning" | "error";

export function useHaptic() {
  const haptic = (style: HapticStyle = "light") => {
    triggerHaptic(style);
  };

  return { haptic };
}
