import { useCallback, useEffect } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";

import { textColors, borderColors } from "@/shared/constants/colors";
import BottomSheet from "@/shared/components/BottomSheet";
import { usePlacesAutocomplete } from "../../hooks";
import type { PlaceResult } from "../../hooks";
import { PlaceSearchInput, PlaceSearchResults } from "../search-spot";

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

  const handleSearchChange = useCallback(
    (query: string) => {
      const shouldSearch = query.trim().length > 0;
      if (shouldSearch) {
        searchPlaces(query);
      } else {
        clearResults();
      }
    },
    [searchPlaces, clearResults]
  );

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
    }
  }, [isOpen, clearResults]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${dayNumber}일차 일정 추가`}
      minHeight="85vh"
      adjustForKeyboard={false}
    >
      <VStack align="stretch" gap={0} px={4} pb={4}>
        <Box py={1.5} borderBottomWidth="1px" borderColor={borderColors.subtle}>
          <Text fontSize="sm" color={textColors.primary} textAlign="center">
            {date}
          </Text>
        </Box>

        <PlaceSearchInput onSearchChange={handleSearchChange} />

        <PlaceSearchResults
          results={results}
          isLoading={isLoading}
          onSelectPlace={handleSelectPlace}
        />
      </VStack>
    </BottomSheet>
  );
}
