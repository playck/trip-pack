import { lazy, Suspense } from "react";
import { Box } from "@chakra-ui/react";
import type { TravelDates } from "@/shared/components/Calendar";

const Calendar = lazy(() => import("@/shared/components/Calendar"));

interface LazyCalendarProps {
  startDate?: Date | null;
  endDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (dates: TravelDates) => void;
  isStartDateFixed?: boolean;
}

export default function LazyCalendar(props: LazyCalendarProps) {
  return (
    <Suspense fallback={<Box w="100%" minH="350px" />}>
      <Calendar {...props} />
    </Suspense>
  );
}
