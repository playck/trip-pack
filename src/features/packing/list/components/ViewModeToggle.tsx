import { HStack, SegmentGroup } from "@chakra-ui/react";
import { Grid3X3, List } from "lucide-react";

import { STORAGE_KEYS } from "@/shared/constants/stroage";

interface ViewModeToggleProps {
  viewMode: string;
  onViewModeChange: (mode: string) => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  const handleViewModeChange = (details: { value: string | null }) => {
    if (details.value) {
      onViewModeChange(details.value);
      localStorage.setItem(STORAGE_KEYS.TRIP_PACK_VIEW_MODE, details.value);
    }
  };

  return (
    <HStack justify="flex-end" align="center">
      <HStack gap={2}>
        <SegmentGroup.Root
          size="sm"
          value={viewMode}
          onValueChange={handleViewModeChange}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items
            items={[
              {
                value: "그리드",
                label: (
                  <HStack gap={2}>
                    <Grid3X3
                      size={18}
                      color={
                        viewMode === "그리드" ? "#3182CE" : "currentColor"
                      }
                    />
                  </HStack>
                ),
              },
              {
                value: "일렬형식",
                label: (
                  <HStack gap={2}>
                    <List
                      size={18}
                      color={
                        viewMode === "일렬형식" ? "#3182CE" : "currentColor"
                      }
                    />
                  </HStack>
                ),
              },
            ]}
          />
        </SegmentGroup.Root>
      </HStack>
    </HStack>
  );
}

