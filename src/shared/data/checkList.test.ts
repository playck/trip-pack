import { describe, it, expect } from "vitest";

import {
  isIncludedInStyle,
  ESSENTIAL_ITEMS,
  DOMESTIC_ESSENTIAL_ITEMS,
  ELECTRONICS_ITEMS,
  CLOTHING_ITEMS,
  TOILETRIES_ITEMS,
  COSMETICS_ITEMS,
  EMERGENCY_MED_ITEMS,
  MISC_OPTIONAL_ITEMS,
  SUMMER_ITEMS,
  WINTER_ITEMS,
  RAINY_ITEMS,
  FITNESS_GYM_ITEMS,
  SWIM_WATER_ITEMS,
  KOREAN_FOOD_ITEMS,
  BUSINESS_ITEMS,
  SIGHTSEEING_ITEMS,
  NATURE_ITEMS,
  ACTIVITY_ITEMS,
  RESORT_ITEMS,
  SHOPPING_ITEMS,
  BABY_ITEMS,
  PET_TRAVEL_ITEMS,
  type PackItem,
} from "./checkList";

/** 짐 스타일이 적용되는 고정 블록 */
const FIXED_BLOCK: PackItem[] = [
  ...ELECTRONICS_ITEMS,
  ...CLOTHING_ITEMS,
  ...TOILETRIES_ITEMS,
  ...COSMETICS_ITEMS,
  ...EMERGENCY_MED_ITEMS,
  ...MISC_OPTIONAL_ITEMS,
];

/** 필터를 타지 않는 배열들 — 필수 준비물과 조건부 카테고리 */
const OUTSIDE_FIXED_BLOCK: Record<string, PackItem[]> = {
  ESSENTIAL_ITEMS,
  DOMESTIC_ESSENTIAL_ITEMS,
  SUMMER_ITEMS,
  WINTER_ITEMS,
  RAINY_ITEMS,
  FITNESS_GYM_ITEMS,
  SWIM_WATER_ITEMS,
  KOREAN_FOOD_ITEMS,
  BUSINESS_ITEMS,
  SIGHTSEEING_ITEMS,
  NATURE_ITEMS,
  ACTIVITY_ITEMS,
  RESORT_ITEMS,
  SHOPPING_ITEMS,
  BABY_ITEMS,
  PET_TRAVEL_ITEMS,
};

describe("isIncludedInStyle", () => {
  it("tier 미지정은 core 로 취급한다", () => {
    expect(isIncludedInStyle(undefined, "minimal")).toBe(true);
    expect(isIncludedInStyle(undefined, "full")).toBe(true);
  });

  it("minimal 은 optional 을 제외한다", () => {
    expect(isIncludedInStyle("core", "minimal")).toBe(true);
    expect(isIncludedInStyle("optional", "minimal")).toBe(false);
  });

  it("full 은 전부 포함한다", () => {
    expect(isIncludedInStyle("core", "full")).toBe(true);
    expect(isIncludedInStyle("optional", "full")).toBe(true);
  });
});

describe("등급 데이터 무결성", () => {
  it("고정 블록 밖에는 tier 를 부여하지 않는다", () => {
    // 필수 준비물과 조건부 카테고리는 filterByPackingStyle 을 타지 않으므로
    // tier 를 달아두면 읽히지 않는 죽은 데이터가 된다.
    for (const [name, items] of Object.entries(OUTSIDE_FIXED_BLOCK)) {
      const graded = items.filter((item) => item.tier).map((item) => item.name);
      expect(graded, name).toEqual([]);
    }
  });

  it("고정 블록의 등급 분포가 의도한 값이다", () => {
    // 등급을 고치면 이 숫자도 같이 고쳐야 한다. 의도한 변경임을 확인하는 장치다.
    const optional = FIXED_BLOCK.filter((item) => item.tier === "optional");
    expect(FIXED_BLOCK).toHaveLength(46);
    expect(optional).toHaveLength(24);
  });

  it("고정 블록에 같은 이름이 두 번 없다", () => {
    const names = FIXED_BLOCK.map((item) => item.name);
    const duplicated = names.filter((n, i) => names.indexOf(n) !== i);
    expect(duplicated).toEqual([]);
  });
});

describe("되살림용 이름 일치", () => {
  // 조건부 카테고리가 고정 블록의 optional 항목을 되살리려면 이름이 정확히
  // 같아야 한다. 한 글자만 달라도 중복 제거가 못 잡아 둘 다 남거나,
  // minimal 에서 본체 없는 파생물만 남는다.
  const fixedOptionalNames = new Set(
    FIXED_BLOCK.filter((item) => item.tier === "optional").map(
      (item) => item.name
    )
  );

  it.each([
    ["SUMMER_ITEMS", SUMMER_ITEMS, ["모자", "선글라스", "모기퇴치제(스프레이/로션)"]],
    ["WINTER_ITEMS", WINTER_ITEMS, ["립밤"]],
    ["RAINY_ITEMS", RAINY_ITEMS, ["수건(여행용 속건타월)"]],
  ] as const)("%s 의 되살림 항목이 고정 블록과 이름이 같다", (_, items, expected) => {
    for (const name of expected) {
      expect(fixedOptionalNames.has(name)).toBe(true);
      expect(items.map((item) => item.name)).toContain(name);
    }
  });
});
