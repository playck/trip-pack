// OpenWeatherMap API를 사용한 날씨 정보 서비스
// 무료 플랜: 1000 calls/day, 60 calls/minute

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    avgTemp: number;
    description: string;
    icon: string;
  }>;
  location: {
    name: string;
    country: string;
  };
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pop?: number;
  }>;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// 좌표로 5일 예보 조회 (평균 기온만)
export const getForecastByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData["forecast"]> => {
  try {
    const res = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!res.ok) {
      throw new Error(`날씨 예보를 불러올 수 없습니다: ${res.status}`);
    }

    const data: OpenWeatherForecastResponse = await res.json();

    // 3시간 간격 데이터를 일별로 그룹화하고 평균 계산
    const dailyForecasts = new Map<
      string,
      {
        date: string;
        tempMax: number;
        tempMin: number;
        description: string;
        icon: string;
        temps: number[];
      }
    >();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];

      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          temps: [item.main.temp],
        });
      } else {
        const existing = dailyForecasts.get(date);

        if (existing) {
          existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
          existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
          existing.temps.push(item.main.temp);
        }
      }
    });

    return Array.from(dailyForecasts.values())
      .slice(0, 7)
      .map((forecast) => ({
        date: forecast.date,
        avgTemp: Math.round(
          forecast.temps.reduce((a: number, b: number) => a + b, 0) /
            forecast.temps.length
        ),
        description: forecast.description,
        icon: forecast.icon,
      }));
  } catch (error) {
    console.error("날씨 예보 API 에러:", error);
    throw new Error("날씨 예보를 불러오는데 실패했습니다.");
  }
};

// 도시명으로 전체 날씨 정보 조회 (예보만 사용)
export const getWeatherByCity = async (
  cityName: string
): Promise<WeatherData> => {
  try {
    // 도시 좌표 조회
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        cityName
      )}&limit=1&appid=${API_KEY}`
    );

    if (!geoResponse.ok) {
      throw new Error("도시를 찾을 수 없습니다.");
    }

    const geoData = await geoResponse.json();
    if (!geoData.length) {
      throw new Error("해당 도시를 찾을 수 없습니다.");
    }

    const { lat, lon, name, country } = geoData[0];

    // 예보만 조회 (첫 번째 예보가 현재 날씨 역할)
    const forecast = await getForecastByCoords(lat, lon);

    return {
      current: {
        temp: forecast[0]?.avgTemp || 0,
        description: forecast[0]?.description || "정보 없음",
        icon: forecast[0]?.icon || "01d",
      },
      forecast,
      location: {
        name: name || cityName,
        country: country || "KR",
      },
    };
  } catch (error) {
    console.error("도시 날씨 조회 에러:", error);
    throw error;
  }
};
