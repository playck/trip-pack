import { useAtom } from "jotai";
import Calendar, { type TravelDates } from "@/shared/components/Calendar";
import { packingCreateAtom } from "../store/packingCreateAtom";

export default function SearchCalendar() {
  const [packingState, setPackingState] = useAtom(packingCreateAtom);

  const handleDateChange = (dates: TravelDates) => {
    setPackingState((prev) => ({
      ...prev,
      dates,
    }));
  };

  return (
    <Calendar
      startDate={packingState.dates.startDate}
      endDate={packingState.dates.endDate}
      onChange={handleDateChange}
    />
  );
}
