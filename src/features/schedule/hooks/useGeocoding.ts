import { useState, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * regionId 파싱
 * 예: "cn-jiuzhaigou" → { countryCode: "CN", regionName: "jiuzhaigou" }
 */
const parseRegionId = (
  regionId: string | null | undefined
): { countryCode: string; regionName: string } | null => {
  if (!regionId) return null;

  const parts = regionId.split("-");
  if (parts.length < 2) return null;

  return {
    countryCode: parts[0].toUpperCase(),
    regionName: parts.slice(1).join("-"),
  };
};

const makeOptimalSearchQuery = (
  regionName: string | null | undefined,
  regionId: string | null | undefined
): string | null => {
  const parsed = parseRegionId(regionId);

  if (parsed) {
    return `${parsed.regionName}, ${parsed.countryCode}`;
  }

  return regionName || null;
};

export const useGeocoding = (
  regionName: string | null | undefined,
  regionId: string | null | undefined
) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const geocodingLib = useMapsLibrary("geocoding");

  useEffect(() => {
    if (!geocodingLib) return;

    const searchQuery = makeOptimalSearchQuery(regionName, regionId);

    if (!searchQuery) {
      setCoordinates(null);
      return;
    }

    const geocodeAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const geocoder = new geocodingLib.Geocoder();

        console.log("🗺️ Geocoding 검색:", {
          searchQuery,
          regionName,
          regionId,
          parsed: parseRegionId(regionId),
        });

        const result = await geocoder.geocode({ address: searchQuery });

        if (result.results && result.results.length > 0) {
          const location = result.results[0].geometry.location;
          const coords = {
            lat: location.lat(),
            lng: location.lng(),
          };

          console.log("✅ Geocoding 성공:", {
            query: searchQuery,
            result: coords,
            foundAddress: result.results[0].formatted_address,
          });

          setCoordinates(coords);
        } else {
          console.warn("⚠️ Geocoding 결과 없음:", searchQuery);
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
  }, [geocodingLib, regionName, regionId]);

  return { coordinates, isLoading, error };
};
