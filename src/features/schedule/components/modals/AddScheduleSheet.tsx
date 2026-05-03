import { useCallback, useEffect, useState } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";

import { textColors, borderColors } from "@/shared/constants/colors";
import BottomSheet from "@/shared/components/BottomSheet";
import {
  PlaceSearchInput,
  PlaceSearchResults,
  PlaceCategoryFilterList,
} from "../search-spot";
import { usePlacesAutocomplete } from "../../hooks";
import type { PlaceResult } from "../../hooks";

interface AddScheduleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: PlaceResult) => void;
  dayNumber: number;
  date: string;
  countryCode?: string;
}

export default function AddScheduleSheet({
  isOpen,
  onClose,
  onSelectPlace,
  dayNumber,
  date,
  countryCode,
}: AddScheduleSheetProps) {
  const { searchPlaces, results, isLoading, clearResults, getPlaceDetails } =
    usePlacesAutocomplete(countryCode);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    [searchPlaces, clearResults, selectedCategory]
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
    [getPlaceDetails, onSelectPlace, clearResults, onClose]
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
      title={`${dayNumber}일차 일정 추가`}
      expanded
      adjustForKeyboard={false}
    >
      <VStack align="stretch" gap={0} px={4} pb={4}>
        <Box py={1.5} borderBottomWidth="1px" borderColor={borderColors.subtle}>
          <Text fontSize="sm" color={textColors.primary} textAlign="center">
            {date}
          </Text>
        </Box>

        <PlaceSearchInput onSearchChange={handleSearchChange} />

        <PlaceCategoryFilterList
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        <PlaceSearchResults
          results={results}
          isLoading={isLoading}
          onSelectPlace={handleSelectPlace}
        />
      </VStack>
    </BottomSheet>
  );
}
