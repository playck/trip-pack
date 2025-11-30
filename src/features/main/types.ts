export interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  region_name: string | null;
  budget: number | null;
}

export interface TripListData {
  currentTrips: Trip[] | null;
  futureTrips: Trip[];
  pastTrips: Trip[];
  allTrips: Trip[];
}
