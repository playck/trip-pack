import { regionsList, type Region } from "@/shared/data/regions";
import { isRegionRestricted } from "@/shared/data/travelAlert";

const POPULAR_REGION_IDS: string[] = [
  // 한국
  "kr-jeju",
  "kr-busan",
  "kr-gangneung",
  // 일본
  "jp-tokyo",
  "jp-osaka",
  "jp-fukuoka",
  "jp-okinawa",
  "jp-sapporo",
  // 동남아시아
  "vn-danang",
  "th-bangkok",
  "th-phuket",
  "sg-all",
  "ph-cebu",
  "id-bali",
  // 대만 · 홍콩
  "tw-taipei",
  "hk-all",
  // 미주 · 태평양
  "us-hawaii",
  "us-guam",
];

export const popularRegions: Region[] = POPULAR_REGION_IDS.map((id) =>
  regionsList.find((r) => r.id === id),
)
  .filter((r): r is Region => r !== undefined)
  .filter((r) => !isRegionRestricted(r));
