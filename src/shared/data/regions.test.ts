import { describe, expect, it } from "vitest";
import { getVisaRule } from "@/features/packing/create/utils/visaRules";
import { getEntryDeclaration } from "./entryDeclarations";
import { getPlugNote } from "./plugStandards";

describe("내몽골(IMN) 여행", () => {
  // IMN은 지역 구분용 자체 코드라 국가별 규정 표에 없다 — 입국·비자·콘센트는 중국(CN) 기준
  it("비자·입국신고·콘센트 정보를 중국 기준으로 찾는다", () => {
    expect(getVisaRule("IMN", "imn-innermongolia")).toEqual(
      getVisaRule("CN", "imn-innermongolia"),
    );
    expect(getEntryDeclaration("IMN")).toEqual(getEntryDeclaration("CN"));
    expect(getPlugNote("IMN")).toBe(getPlugNote("CN"));
  });
});
