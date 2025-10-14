import { VStack } from "@chakra-ui/react";

import type { PlaceResult } from "../../hooks";
import PlaceResultItem from "./PlaceResultItem";
import SearchStateMessage from "./SearchStateMessage";

interface PlaceSearchResultsProps {
  results: PlaceResult[];
  isLoading: boolean;
  searchQuery: string;
  onSelectPlace: (place: PlaceResult) => void;
}

export default function PlaceSearchResults({
  results,
  isLoading,
  searchQuery,
  onSelectPlace,
}: PlaceSearchResultsProps) {
  const hasResults = results.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const isShowResults = !isLoading && hasResults;

  return (
    <VStack align="stretch" gap={0} flex={1} overflow="auto">
      <SearchStateMessage
        isLoading={isLoading}
        hasResults={hasResults}
        hasSearchQuery={hasSearchQuery}
      />

      {isShowResults &&
        results.map((place) => (
          <PlaceResultItem
            key={place.placeId}
            place={place}
            onClick={onSelectPlace}
          />
        ))}
    </VStack>
  );
}
