import { describe, expect, it } from "vitest";
import { parseAmountText, toKrw } from "./useAmountInput";

describe("parseAmountText", () => {
  it("천 단위 콤마를 제거해 숫자로 읽는다", () => {
    expect(parseAmountText("1,234,567")).toBe(1234567);
  });

  it("소수점 금액(센트)을 버리지 않는다", () => {
    // €12.49가 €12로 읽혀 약 735원이 사라지던 문제
    expect(parseAmountText("12.49")).toBe(12.49);
  });

  it("빈 문자열은 0", () => {
    expect(parseAmountText("")).toBe(0);
  });
});

describe("toKrw", () => {
  it("원화 입력은 그대로 저장한다", () => {
    expect(toKrw(12000, "KRW", 0)).toBe(12000);
  });

  it("현지 통화는 환율을 곱해 원 단위로 반올림한다", () => {
    expect(toKrw(3000, "LOCAL", 9.35)).toBe(28050);
  });

  it("현지 통화인데 환율이 없으면 변환하지 않고 null을 돌려준다", () => {
    // 오프라인·환율 API 실패로 환율이 0일 때 ¥1,200이 1,200원으로 저장되던 문제
    expect(toKrw(1200, "LOCAL", 0)).toBeNull();
  });
});
