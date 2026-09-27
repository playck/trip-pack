import { describe, expect, it } from "vitest";
import { getVisaRule } from "./visaRules";

describe("getVisaRule", () => {
  it("비자 데이터가 없는 나라는 '확인 필요'로만 두고 비자 필수로 단정하지 않는다", () => {
    // 무비자인 유럽 국가 여행에 '비자'(필수) 항목이 생기던 문제
    const rule = getVisaRule("ZZ", undefined);
    expect(rule.isUnknown).toBe(true);
    expect(rule.required).toBe(false);
  });
});
