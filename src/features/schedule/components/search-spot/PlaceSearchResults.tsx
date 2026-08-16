import { VStack } from "@chakra-ui/react";

import type { PlaceResult } from "../../hooks";
import PlaceResultItem from "./PlaceResultItem";
import SearchStateMessage from "./SearchStateMessage";

interface PlaceSearchResultsProps {
  results: PlaceResult[];
  isLoading: boolean;
  onSelectPlace: (place: PlaceResult) => void;
  /** 전달 시 각 결과 행에 ♡(가고 싶은 곳 담기) 버튼 노출 */
  onToggleWishlist?: (place: PlaceResult) => void;
  wishlistedPlaceIds?: Set<string>;
}

export default function PlaceSearchResults({
  results,
  isLoading,
  onSelectPlace,
  onToggleWishlist,
  wishlistedPlaceIds,
}: PlaceSearchResultsProps) {
  const hasResults = results.length > 0;
  const hasSearchQuery = isLoading || hasResults;
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
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistedPlaceIds?.has(place.placeId) ?? false}
          />
        ))}
    </VStack>
  );
}
