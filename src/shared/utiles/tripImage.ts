import {
  countryImages,
  DEFAULT_BACKGROUND_IMAGES,
} from "@/shared/data/countryImages";
import { regionsList } from "@/shared/data/regions";

const getIndexFromId = (id: string, length: number) => {
  const seed = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return seed % length;
};

interface TripImageParams {
  id: string;
  regionName: string | null;
  countryCode?: string | null;
  imageUrl?: string | null;
}

export const getTripBackgroundImage = (trip: TripImageParams): string => {
  if (trip.imageUrl) {
    return trip.imageUrl;
  }

  const region = regionsList.find((r) => r.name === trip.regionName);
  if (!region) {
    return DEFAULT_BACKGROUND_IMAGES[
      getIndexFromId(trip.id, DEFAULT_BACKGROUND_IMAGES.length)
    ];
  }

  const images = countryImages[region.countryCode];
  if (!images || images.length === 0) {
    return DEFAULT_BACKGROUND_IMAGES[
      getIndexFromId(trip.id, DEFAULT_BACKGROUND_IMAGES.length)
    ];
  }

  return images[getIndexFromId(trip.id, images.length)];
};
