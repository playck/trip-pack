export interface Trip {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  region_name: string | null;
  budget: number | null;
  country_code: string | null;
  image_url: string | null;
}

export interface TripListData {
  currentTrips: Trip[] | null;
  futureTrips: Trip[];
  pastTrips: Trip[];
  allTrips: Trip[];
  /** 내가 만든 여행 수 — 무료 한도 계산용 */
  ownedTripCount: number;
}
