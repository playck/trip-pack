import { describe, it, expect } from "vitest";

import { regionsList } from "@/shared/data/regions";
import type { PackingCreateState } from "../store/packingCreateAtom";

import { generateCheckList } from "./generateCheckList";

/** 짐 스타일이 적용되는 고정 6개 카테고리 */
const FIXED_CATEGORIES = new Set([
  "전자제품",
  "의류",
  "세면용품",
  "화장품",
  "상비약",
  "기타용품",
]);

const findRegion = (keyword: string) => {
  const region = regionsList.find((r) => r.name.includes(keyword));
  if (!region) throw new Error(`지역을 찾을 수 없음: ${keyword}`);
  return region;
};

const buildState = (
  overrides: Partial<PackingCreateState> = {}
): PackingCreateState => ({
  region: findRegion("도쿄"),
  dates: {
    startDate: new Date("2026-10-15"),
    endDate: new Date("2026-10-18"),
  },
  companion: "withCompanion",
  companionTypes: ["친구"],
  tripTypes: ["관광", "미식"],
  startMode: "auto",
  ...overrides,
});

const allItems = (list: ReturnType<typeof generateCheckList>) =>
  list.flatMap((category) => category.items);

const itemNames = (list: ReturnType<typeof generateCheckList>) =>
  allItems(list).map((item) => item.name);

/** 계절·여행유형처럼 사용자가 고른 조건으로 붙는 카테고리 */
const conditionalCategories = (list: ReturnType<typeof generateCheckList>) =>
  list.filter((category) => !FIXED_CATEGORIES.has(category.categoryName));

const CASES: { label: string; state: PackingCreateState }[] = [
  {
    label: "도쿄 3박4일 관광+미식 (10월, 계절 카테고리 없음)",
    state: buildState(),
  },
  {
    label: "방콕 5박6일 휴양+수영 (1월, 열대라 여름)",
    state: buildState({
      region: findRegion("방콕"),
      dates: {
        startDate: new Date("2027-01-10"),
        endDate: new Date("2027-01-16"),
      },
      companionTypes: ["연인"],
      tripTypes: ["휴양", "수영"],
    }),
  },
  {
    label: "제주 2박3일 조건 없음 (7월, 여름+우기)",
    state: buildState({
      region: findRegion("제주"),
      dates: {
        startDate: new Date("2026-07-10"),
        endDate: new Date("2026-07-13"),
      },
      companion: "alone",
      companionTypes: [],
      tripTypes: [],
    }),
  },
  {
    label: "도쿄 4박5일 관광 (12월, 겨울)",
    state: buildState({
      dates: {
        startDate: new Date("2026-12-20"),
        endDate: new Date("2026-12-25"),
      },
      companion: "alone",
      companionTypes: [],
      tripTypes: ["관광"],
    }),
  },
];

describe("generateCheckList - 기존 동작 보존", () => {
  it("성향을 넘기지 않으면 full 과 같은 결과를 낸다", () => {
    for (const { label, state } of CASES) {
      expect(generateCheckList(state), label).toEqual(
        generateCheckList(state, "full")
      );
    }
  });
});

describe.each(CASES)("generateCheckList - $label", ({ state }) => {
  const full = generateCheckList(state, "full");
  const minimal = generateCheckList(state, "minimal");

  it("minimal 이 full 보다 항목이 적다", () => {
    expect(allItems(minimal).length).toBeLessThan(allItems(full).length);
  });

  it("필수 준비물은 minimal 에서도 한 개도 빠지지 않는다", () => {
    const essential = full.find((c) => !FIXED_CATEGORIES.has(c.categoryName));
    expect(essential).toBeDefined();

    const names = itemNames(minimal);
    const missing = full
      .filter((c) => c.categoryName === "필수 준비물")
      .flatMap((c) => c.items)
      .filter((item) => !names.includes(item.name))
      .map((item) => item.name);

    expect(missing).toEqual([]);
  });

  it("core 등급 항목은 minimal 에서 전원 생존한다", () => {
    const names = itemNames(minimal);
    const dropped = full
      .filter((c) => FIXED_CATEGORIES.has(c.categoryName))
      .flatMap((c) => c.items)
      .filter((item) => item.tier !== "optional")
      .filter((item) => !names.includes(item.name))
      .map((item) => item.name);

    expect(dropped).toEqual([]);
  });

  it("사용자가 고른 조건부 카테고리는 minimal 에서 줄어들지 않는다", () => {
    // "불변"이 아니라 ">=" 가 옳다. 고정 블록에서 빠진 항목을 조건부 카테고리가
    // 되살리면(되살림) 오히려 늘어난다.
    for (const fullCategory of conditionalCategories(full)) {
      const minimalCategory = minimal.find(
        (c) => c.categoryName === fullCategory.categoryName
      );
      expect(minimalCategory, fullCategory.categoryName).toBeDefined();
      expect(
        minimalCategory!.items.length,
        fullCategory.categoryName
      ).toBeGreaterThanOrEqual(fullCategory.items.length);
    }
  });

  it("같은 이름의 항목이 두 번 나오지 않는다", () => {
    // 조건부 카테고리에 고정 블록과 같은 물건을 다른 이름으로 두면
    // 중복 제거가 못 잡아 "본체 없는 파생물"이 남는다. 그 회귀를 막는다.
    for (const [style, list] of [
      ["full", full],
      ["minimal", minimal],
    ] as const) {
      const names = itemNames(list);
      const duplicated = names.filter((n, i) => names.indexOf(n) !== i);
      expect(duplicated, style).toEqual([]);
    }
  });
});

describe("generateCheckList - 되살림", () => {
  it("여름·열대 목적지면 minimal 에서도 모자·선글라스·모기퇴치제를 받는다", () => {
    const state = CASES[1].state; // 방콕 1월 (열대 = 여름)
    const names = itemNames(generateCheckList(state, "minimal"));

    expect(names).toContain("모자");
    expect(names).toContain("선글라스");
    expect(names).toContain("모기퇴치제(스프레이/로션)");
  });

  it("겨울이면 minimal 에서도 립밤을 받는다", () => {
    const state = CASES[3].state; // 도쿄 12월
    expect(itemNames(generateCheckList(state, "minimal"))).toContain("립밤");
  });

  it("우기면 minimal 에서도 수건을 받는다", () => {
    const state = CASES[2].state; // 제주 7월 (여름+우기)
    expect(itemNames(generateCheckList(state, "minimal"))).toContain(
      "수건(여행용 속건타월)"
    );
  });

  it("되살림 대상은 full 에서 중복되지 않는다", () => {
    const state = CASES[1].state;
    const names = itemNames(generateCheckList(state, "full"));
    const hatCount = names.filter((n) => n === "모자").length;

    expect(hatCount).toBe(1);
  });
});
