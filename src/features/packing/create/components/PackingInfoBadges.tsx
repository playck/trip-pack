import { HStack, Badge } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import { formatDateRange } from "@/shared/utiles/date";
import { packingCreateAtom } from "../store/packingCreateAtom";

export default function PackingInfoBadges() {
  const state = useAtomValue(packingCreateAtom);

  const badges = [];

  if (state.region) {
    badges.push(
      <Badge key="region" variant="outline" size="sm">
        📍 {state.region.name}
      </Badge>
    );
  }

  if (state.dates.startDate && state.dates.endDate) {
    badges.push(
      <Badge key="dates" variant="outline" size="sm">
        📅 {formatDateRange(state.dates.startDate, state.dates.endDate)}
      </Badge>
    );
  }

  if (state.companion) {
    const companionText =
      state.companion === "alone"
        ? "솔로 여행"
        : state.companionTypes.join(", ");

    const companionEmoji = state.companion === "alone" ? "🧑" : "👥";

    badges.push(
      <Badge key="companion" variant="outline" size="sm">
        {companionEmoji} {companionText}
      </Badge>
    );
  }

  if (state.tripTypes.length > 0) {
    badges.push(
      <Badge key="tripTypes" variant="outline" size="sm">
        🎯 {state.tripTypes.join(", ")}
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <HStack gap={2} flexWrap="wrap">
      {badges}
    </HStack>
  );
}
