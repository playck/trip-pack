import { useState, useCallback, useRef } from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";

/**
 * Google Places 검색 결과 타입
 */
export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
}

/**
 * 사용자가 입력한 텍스트로 장소를 검색
 */
export const usePlacesAutocomplete = () => {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placesLib = useMapsLibrary("places");
  const map = useMap("schedule-map");

  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );

  const getPlaceDetails = useCallback(
    (placeId: string): Promise<PlaceResult> => {
      return new Promise((resolve, reject) => {
        if (!placesLib || !map) {
          reject(new Error("Places library or map not ready"));
          return;
        }

        if (!placesServiceRef.current) {
          placesServiceRef.current = new placesLib.PlacesService(map);
        }

        const request: google.maps.places.PlaceDetailsRequest = {
          placeId,
          fields: ["place_id", "name", "formatted_address", "geometry"],
        };

        placesServiceRef.current.getDetails(request, (place, status) => {
          if (status === placesLib.PlacesServiceStatus.OK && place) {
            const result: PlaceResult = {
              placeId: place.place_id || placeId,
              name: place.name || "",
              address: place.formatted_address || "",
              location: place.geometry?.location
                ? {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  }
                : undefined,
            };
            resolve(result);
          } else {
            reject(new Error(`Failed to get place details: ${status}`));
          }
        });
      });
    },
    [placesLib, map]
  );

  /**
   * 장소 검색 함수
   */
  const searchPlaces = useCallback(
    async (query: string) => {
      if (!placesLib || !query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const service = new placesLib.AutocompleteService();

        const request: google.maps.places.AutocompletionRequest = {
          input: query,
          types: ["establishment", "geocode"],
        };

        console.log("🔍 Places 검색:", query);

        // 검색 실행
        service.getPlacePredictions(request, (predictions, status) => {
          if (status === placesLib.PlacesServiceStatus.OK && predictions) {
            const placeResults: PlaceResult[] = predictions.map(
              (prediction) => ({
                placeId: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                address: prediction.structured_formatting.secondary_text || "",
              })
            );

            setResults(placeResults);
          } else if (status === placesLib.PlacesServiceStatus.ZERO_RESULTS) {
            setResults([]);
          } else {
            console.error("❌ Places 검색 에러:", status);
            setError("장소 검색에 실패했습니다");
            setResults([]);
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.error("❌ Places 검색 예외:", err);
        setError("장소 검색 중 오류가 발생했습니다");
        setResults([]);
        setIsLoading(false);
      }
    },
    [placesLib]
  );

  /**
   * 검색 결과 초기화
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    searchPlaces,
    clearResults,
    getPlaceDetails,
    results,
    isLoading,
    error,
  };
};
