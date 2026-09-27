import { describe, it, expect } from "vitest";

import { checkBaggageRule, suggestBaggageKeywords } from "./baggageChecker";
import { BAGGAGE_POLICY_DATA } from "@/shared/data/baggagePolicyData";

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

describe("checkBaggageRule 키워드 매핑", () => {
  const cases: [string, string][] = [
    // 새 아이템
    ["화분", "화분·흙·생화"],
    ["흙", "화분·흙·생화"],
    ["꽃다발", "화분·흙·생화"],
    ["모종", "화분·흙·생화"],
    ["계란", "계란·알가공품"],
    ["달걀", "계란·알가공품"],
    ["생선", "수산물 (생선·해산물)"],
    ["생선회", "수산물 (생선·해산물)"],
    ["건어물", "수산물 (생선·해산물)"],
    ["강아지사료", "반려동물 사료·간식"],
    ["개껌", "반려동물 사료·간식"],
    // 기존 아이템 키워드 보강
    ["전기포트", "전자기기"],
    ["스마트워치", "전자기기"],
    ["견과류", "고형 식품"],
    ["녹차", "고형 식품"],
    ["에센스", "액체류 (화장품/세면도구)"],
    ["매니큐어", "인화성 화장품 (에어로졸·향수)"],
    ["테니스라켓", "스포츠 장비"],
    ["면도날", "칼류"],
    ["향초", "생활용품"],
    ["체온계", "의약품"],
    ["수은체온계", "독성·부식성 물질"],
  ];

  it.each(cases)("%s → %s", (query, expectedName) => {
    expect(checkBaggageRule(query)?.item.name).toBe(expectedName);
  });

  it("1글자 키워드는 의도한 목록만 존재한다 (충돌 위험, 추가 시 검토 필수)", () => {
    const oneChar = BAGGAGE_POLICY_DATA.flatMap((i) => i.keywords).filter(
      (k) => k.length === 1
    );
    expect(oneChar.sort()).toEqual(
      ["귤", "김", "꿀", "떡", "릴", "불", "빵", "숯", "술", "약", "잼", "죽", "총", "칼", "햄", "활", "흙"].sort()
    );
  });
});
