// 여행 날씨 서비스

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { getWeatherByCity } from "../../service/weather/weatherApi";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface TripWeatherRequest {
  cityName: string;
  startDate: string;
  endDate: string;
}

interface TripWeatherDay {
  date: string;
  avgTemp: number;
  description: string;
  icon: string;
  isToday?: boolean;
  isTripDay?: boolean;
}

interface TripWeatherData {
  cityName: string;
  tripPeriod: {
    startDate: string;
    endDate: string;
    daysUntilTrip: number;
  };
  forecast: TripWeatherDay[];
}

/**
 * 여행용 날씨 훅
 * - 출발 7일 전부터 조회 가능
 * - 여행 기간 날씨만 표시
 */

export const useTripWeather = ({
  cityName,
  startDate,
  endDate,
}: TripWeatherRequest) => {
  return useQuery({
    queryKey: ["trip-weather", cityName, startDate, endDate],
    queryFn: async (): Promise<TripWeatherData | null> => {
      const now = dayjs();
      const tripStart = dayjs(startDate);
      const tripEnd = dayjs(endDate);
      const daysUntilTrip = tripStart.diff(now, "day");

      // 출발 7일 이상 남거나, 끝난 여행은 조회 안함
      if (daysUntilTrip > 7 || tripEnd.isBefore(now)) {
        return null;
      }

      try {
        const weatherData = await getWeatherByCity(cityName);

        // 여행 기간에 해당하는 날씨만 필터링
        const tripForecast = weatherData.forecast.filter((day) => {
          const dayDate = dayjs(day.date);
          return (
            dayDate.isSameOrAfter(tripStart, "day") &&
            dayDate.isSameOrBefore(tripEnd, "day")
          );
        });

        // 여행 날씨 데이터로 변환
        const forecast: TripWeatherDay[] = tripForecast.map((day) => ({
          date: day.date,
          avgTemp: day.avgTemp,
          description: day.description,
          icon: day.icon,
          isToday: dayjs(day.date).isSame(now, "day"),
          isTripDay: true,
        }));

        return {
          cityName: weatherData.location.name,
          tripPeriod: {
            startDate,
            endDate,
            daysUntilTrip,
          },
          forecast,
        };
      } catch (error) {
        console.error(`❌ ${cityName} 날씨 조회 실패:`, error);
        throw error;
      }
    },

    enabled: !!cityName && !!startDate && !!endDate,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
    meta: {
      errorMessage: "여행 날씨 정보를 불러오는데 실패했습니다.",
    },
  });
};

export const getTripStatus = (startDate: string, endDate: string) => {
  const now = dayjs();
  const tripStart = dayjs(startDate);
  const tripEnd = dayjs(endDate);
  const daysUntilTrip = tripStart.diff(now, "day");

  if (tripEnd.isBefore(now)) {
    return { status: "ended", message: "여행 종료", daysUntilTrip: 0 };
  }

  if (tripStart.isSameOrBefore(now) && tripEnd.isSameOrAfter(now)) {
    return { status: "ongoing", message: "여행 중", daysUntilTrip: 0 };
  }

  if (daysUntilTrip > 7) {
    return {
      status: "too-early",
      message: `출발까지 ${daysUntilTrip}일`,
      daysUntilTrip,
    };
  }

  if (daysUntilTrip === 0) {
    return { status: "today", message: "오늘 출발", daysUntilTrip: 0 };
  }

  return {
    status: "upcoming",
    message: `D-${daysUntilTrip}`,
    daysUntilTrip,
  };
};

export const getWeatherEmoji = (iconCode: string): string => {
  const emojiMap: Record<string, string> = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "☁️",
    "04n": "☁️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌦️",
    "10n": "🌧️",
    "11d": "⛈️",
    "11n": "⛈️",
    "13d": "❄️",
    "13n": "❄️",
    "50d": "🌫️",
    "50n": "🌫️",
  };

  return emojiMap[iconCode] || "🌤️";
};
