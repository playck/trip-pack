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

describe("checkBaggageRule 오탐 방지", () => {
  // 1글자 키워드는 단어 끝에서만 매칭한다 — 한국어 합성어는 핵심 명사가 뒤에 온다
  const headFinalCases: [string, string][] = [
    ["칼", "칼류"],
    ["식칼", "칼류"],
    ["과도 칼", "칼류"],
    ["감기약", "의약품"],
    ["약(아이용)", "의약품"],
    ["불면증약", "의약품"],
  ];

  it.each(headFinalCases)("%s → %s (단어 끝 매칭)", (query, expectedName) => {
    expect(checkBaggageRule(query)?.item.name).toBe(expectedName);
  });

  // 단어 앞·중간에 1글자 키워드가 있거나, 너무 일반적인 2글자 이상 키워드에 걸리던 이름들
  const falsePositives: [string, string][] = [
    ["까스활명수", "무기류·호신용품"],
    ["생활용품", "무기류·호신용품"],
    ["총무 지갑", "무기류·호신용품"],
    ["칼슘 영양제", "칼류"],
    ["칼라렌즈", "칼류"],
    ["필기도구", "칼류"],
    ["화장도구", "칼류"],
    ["알콜솜", "주류 (술)"],
    ["기름종이", "식용 기름"],
    ["헤어 액세서리", "금 제품"],
    ["골드키위", "금 제품"],
    ["아이 킥보드", "전동킥보드/전동휠"],
  ];

  it.each(falsePositives)("%s는 %s로 판정하지 않는다", (query, wrongName) => {
    expect(checkBaggageRule(query)?.item.name).not.toBe(wrongName);
  });
});
