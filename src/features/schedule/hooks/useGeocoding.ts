import { useState, useEffect } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * 최적의 Geocoding 검색어 생성
 * 우선순위: regionName + countryCode > regionName만
 */
const makeOptimalSearchQuery = (
  regionName: string | null | undefined,
  countryCode?: string | null | undefined
): string | null => {
  if (!regionName) return null;

  if (countryCode) {
    return `${regionName}, ${countryCode}`;
  }

  return regionName;
};

export const useGeocoding = (
  regionName: string | null | undefined,
  countryCode?: string | null | undefined
) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchQuery = makeOptimalSearchQuery(regionName, countryCode);

    if (!searchQuery) {
      setCoordinates(null);
      return;
    }

    const geocodeAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const geocoder = new google.maps.Geocoder();

        const result = await geocoder.geocode({ address: searchQuery });

        if (result.results && result.results.length > 0) {
          const location = result.results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng(),
          };

          setCoordinates(coords);
        } else {
          setError("위치를 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("❌ Geocoding 에러:", error);
        setError("위치 검색 중 오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [regionName, countryCode]);

  return { coordinates, isLoading, error };
};
