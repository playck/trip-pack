import { describe, expect, it } from "vitest";
import { regionsList } from "@/shared/data/regions";
import { CURRENCY_BY_COUNTRY, getCurrencyByCountryCode } from "./currency";

describe("CURRENCY_BY_COUNTRY", () => {
  it("여행지로 고를 수 있는 모든 국가 코드에 통화가 정해져 있다", () => {
    // 표에 없으면 조용히 USD로 처리돼 기호·환율·현지 입력이 모두 틀린다
    const missing = [...new Set(regionsList.map((r) => r.countryCode))].filter(
      (code) => !CURRENCY_BY_COUNTRY[code],
    );
    expect(missing).toEqual([]);
  });

  it("유로를 쓰는 크로아티아·발트 3국·슬로베니아는 EUR", () => {
    for (const code of ["HR", "EE", "LV", "LT", "SI"]) {
      expect(getCurrencyByCountryCode(code)).toBe("eur");
    }
  });

  it("몰디브는 리조트 결제 관행에 맞춰 USD", () => {
    expect(getCurrencyByCountryCode("MV")).toBe("usd");
  });
});
