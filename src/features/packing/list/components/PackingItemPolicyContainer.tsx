import { CabinPolicyModal } from "@/shared/components";
import { useBaggagePolicy } from "../hooks/useBaggagePolicy";
import type { ChecklistItem } from "../../type";

interface PackingItemPolicyContainerProps {
  isOpen: boolean;
  onClose: () => void;
  item: ChecklistItem | null;
  countryCode?: string | null;
}

export default function PackingItemPolicyContainer({
  isOpen,
  onClose,
  item,
  countryCode,
}: PackingItemPolicyContainerProps) {
  const {
    cabinPolicy,
    cabinNotes,
    checkedPolicy,
    checkedNotes,
    countryWarning,
  } = useBaggagePolicy(item, countryCode);

  return (
    <CabinPolicyModal
      isOpen={isOpen && !!item}
      onClose={onClose}
      itemName={item?.name || ""}
      policy={cabinPolicy}
      cabinNotes={cabinNotes}
      checkedPolicy={checkedPolicy}
      checkedNotes={checkedNotes}
      countryWarning={countryWarning}
    />
  );
}
