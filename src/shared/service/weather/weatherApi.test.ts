import { afterEach, describe, expect, it, vi } from "vitest";
import { getForecastByCoords } from "./weatherApi";

const slot = (iso: string, temp: number) => ({
  dt: Date.parse(iso) / 1000,
  main: { temp, temp_max: temp, temp_min: temp, humidity: 50 },
  weather: [{ main: "Clear", description: "맑음", icon: "01d" }],
});

describe("getForecastByCoords", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("3시간 예보를 UTC가 아니라 여행지 현지 날짜로 묶는다", async () => {
    // 뉴욕(UTC-4): UTC 10/5 00:00 = 현지 10/4 20:00 → 10/4 로 묶여야 한다
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          city: { timezone: -4 * 3600 },
          list: [
            slot("2026-10-04T18:00:00Z", 20), // 현지 10/4 14:00
            slot("2026-10-05T00:00:00Z", 10), // 현지 10/4 20:00
            slot("2026-10-05T15:00:00Z", 30), // 현지 10/5 11:00
          ],
        }),
      }),
    );

    const forecast = await getForecastByCoords(40.7, -74);

    expect(forecast.map((d) => [d.date, d.avgTemp])).toEqual([
      ["2026-10-04", 15],
      ["2026-10-05", 30],
    ]);
  });
});
