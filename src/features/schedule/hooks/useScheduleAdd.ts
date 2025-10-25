import { useState } from "react";
import { useCreateSchedule } from "../services/useCreateSchedule";
import type { PlaceResult } from "./usePlacesAutocomplete";

interface SelectedDay {
  dayNumber: number;
  date: string;
}

export const useScheduleAdd = (tripId: string) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const createScheduleMutation = useCreateSchedule(tripId);

  const handleAddSchedule = (dayNumber: number, date: string) => {
    setSelectedDay({ dayNumber, date });
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    if (!tripId || !selectedDay) {
      return;
    }

    createScheduleMutation.mutate({
      tripId,
      dayNumber: selectedDay.dayNumber,
      scheduleDate: selectedDay.date,
      placeId: place.placeId,
      placeName: place.name,
      placeAddress: place.address,
      latitude: place.location?.lat,
      longitude: place.location?.lng,
    });
  };

  return {
    isSheetOpen,
    selectedDay,
    handleAddSchedule,
    handleCloseSheet,
    handleSelectPlace,
  };
};
