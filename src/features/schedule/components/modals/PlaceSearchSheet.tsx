import { useCallback, useEffect, useMemo, useState } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";

import { textColors } from "@/shared/constants/colors";
import BottomSheet from "@/shared/components/BottomSheet";
import {
  PlaceSearchInput,
  PlaceSearchResults,
  PlaceCategoryFilterList,
} from "../search-spot";
import { usePlacesAutocomplete } from "../../hooks";
import type { PlaceResult } from "../../hooks";
import { useTripWishlists } from "../../services/useTripWishlists";
import { useCreateWishlist } from "../../services/useCreateWishlist";
import { useDeleteWishlist } from "../../services/useDeleteWishlist";
import { mapGoogleTypesToIconKey } from "../../memoIcons";

export interface PlaceSearchTargetDay {
  dayNumber: number;
  date: string;
}

interface PlaceSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  onSelectPlace: (place: PlaceResult) => void;
  /** 일차 맥락. 없으면 보관함 전용 모드 (♡ 숨김) */
  targetDay?: PlaceSearchTargetDay;
  countryCode?: string;
}

export default function PlaceSearchSheet({
  isOpen,
  onClose,
  tripId,
  onSelectPlace,
  targetDay,
  countryCode,
}: PlaceSearchSheetProps) {
  const { searchPlaces, results, isLoading, clearResults, getPlaceDetails } =
    usePlacesAutocomplete(countryCode);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: wishlists = [] } = useTripWishlists(isOpen ? tripId : undefined);
  const createWishlistMutation = useCreateWishlist(tripId);
  const deleteWishlistMutation = useDeleteWishlist(tripId);

  // 일차 맥락에서만 ♡(가고 싶은 곳 담기) 노출
  const showWishlistFeatures = !!targetDay;

  const wishlistedPlaceIds = useMemo(
    () => new Set(wishlists.map((w) => w.place_id)),
    [wishlists]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const shouldSearch = query.trim().length > 0;

      if (shouldSearch) {
        searchPlaces(query, selectedCategory || undefined);
      } else {
        clearResults();
      }
    },
    [searchPlaces, clearResults, selectedCategory],
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (searchQuery.trim().length > 0) {
      searchPlaces(searchQuery, category || undefined);
    }
  };

  const handleSelectPlace = useCallback(
    async (place: PlaceResult) => {
      try {
        const detailedPlace = await getPlaceDetails(place.placeId);

        onSelectPlace(detailedPlace);
        clearResults();
        onClose();
      } catch (error) {
        console.error("❌ 장소 상세 정보 가져오기 실패:", error);
        onSelectPlace(place);
        clearResults();
        onClose();
      }
    },
    [getPlaceDetails, onSelectPlace, clearResults, onClose],
  );

  // ♡ 토글 — 시트를 닫지 않고 연속으로 담을 수 있다
  const handleToggleWishlist = useCallback(
    async (place: PlaceResult) => {
      const existing = wishlists.find((w) => w.place_id === place.placeId);

      if (existing) {
        deleteWishlistMutation.mutate(existing.id);
        return;
      }

      let detailedPlace = place;
      try {
        detailedPlace = await getPlaceDetails(place.placeId);
      } catch (error) {
        console.error("❌ 장소 상세 정보 가져오기 실패:", error);
      }

      createWishlistMutation.mutate({
        tripId,
        placeId: detailedPlace.placeId,
        placeName: detailedPlace.name,
        placeAddress: detailedPlace.address,
        latitude: detailedPlace.location?.lat,
        longitude: detailedPlace.location?.lng,
        category: mapGoogleTypesToIconKey(detailedPlace.types),
      });
    },
    [wishlists, deleteWishlistMutation, createWishlistMutation, getPlaceDetails, tripId],
  );

  useEffect(() => {
    if (!isOpen) {
      clearResults();
      setSearchQuery("");
      setSelectedCategory("");
    }
  }, [isOpen, clearResults]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        targetDay ? `${targetDay.dayNumber}일차 일정 추가` : "가고 싶은 곳 추가"
      }
      size="max"
    >
      <VStack align="stretch" gap={0} px={4} pb={4}>
        {targetDay && (
          <Box py={0.5}>
            <Text fontSize="sm" color={textColors.primary} textAlign="right">
              {targetDay.date}
            </Text>
          </Box>
        )}

        <PlaceSearchInput onSearchChange={handleSearchChange} />

        <PlaceCategoryFilterList
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <PlaceSearchResults
          results={results}
          isLoading={isLoading}
          onSelectPlace={handleSelectPlace}
          onToggleWishlist={
            showWishlistFeatures ? handleToggleWishlist : undefined
          }
          wishlistedPlaceIds={wishlistedPlaceIds}
        />
      </VStack>
    </BottomSheet>
  );
}
