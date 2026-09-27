import { describe, it, expect } from "vitest";

import { suggestBaggageKeywords } from "./baggageChecker";

describe("suggestBaggageKeywords", () => {
  it("입력값을 포함하는 키워드를 제안한다", () => {
    expect(suggestBaggageKeywords("보조")).toContain("보조배터리");
  });

  it("입력값과 완전히 같은 키워드는 제외한다", () => {
    const result = suggestBaggageKeywords("김");
    expect(result).toEqual(expect.arrayContaining(["김밥", "김치"]));
    expect(result).not.toContain("김");
  });

  it("입력값으로 시작하는 키워드를 앞에 둔다", () => {
    expect(suggestBaggageKeywords("배터")[0]).toBe("배터리");
  });

  it("최대 4개까지만 반환한다", () => {
    expect(suggestBaggageKeywords("스").length).toBeLessThanOrEqual(4);
  });

  it("빈 입력이면 빈 배열", () => {
    expect(suggestBaggageKeywords("  ")).toEqual([]);
  });
});
