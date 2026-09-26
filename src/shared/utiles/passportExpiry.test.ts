import { describe, it, expect } from "vitest";

import {
  checkPassportExpiry,
  PASSPORT_VALIDITY_MONTHS,
} from "./passportExpiry";

// 전부 고정 날짜로 판정한다. 코어가 "오늘"을 안 보므로 fake timer 가 필요 없다.
const 출발일 = "2026-03-01";

describe("checkPassportExpiry — 6개월 경계", () => {
  it("정확히 6개월이면 통과한다", () => {
    const result = checkPassportExpiry("2026-09-01", 출발일);
    expect(result.status).toBe("ok");
    expect(result.monthsLeft).toBe(6);
  });

  it("6개월에서 하루 모자라면 부족으로 본다", () => {
    const result = checkPassportExpiry("2026-08-31", 출발일);
    expect(result.status).toBe("insufficient");
    expect(result.monthsLeft).toBe(5);
  });

  it("여유가 넉넉하면 통과한다", () => {
    expect(checkPassportExpiry("2031-04-12", 출발일).status).toBe("ok");
  });
});

describe("checkPassportExpiry — 만료 판정", () => {
  it("만료일이 출발일보다 앞서면 만료다", () => {
    expect(checkPassportExpiry("2026-02-28", 출발일).status).toBe("expired");
  });

  it("출발일 당일 만료도 만료로 본다 (당일 만료 여권은 입국이 막힌다)", () => {
    expect(checkPassportExpiry(출발일, 출발일).status).toBe("expired");
  });

  it("출발 다음 날 만료는 만료가 아니라 부족이다", () => {
    const result = checkPassportExpiry("2026-03-02", 출발일);
    expect(result.status).toBe("insufficient");
    expect(result.monthsLeft).toBe(0);
  });
});

describe("checkPassportExpiry — 읽을 수 없는 값", () => {
  // 저장소가 비거나 값이 깨졌을 때 `ok` 로 떨어지면 경고가 조용히 꺼진다.
  it.each([null, "", "not-a-date", "2026-13-45"])(
    "%s 는 unregistered 로 떨어진다",
    (value) => {
      const result = checkPassportExpiry(value, 출발일);
      expect(result.status).toBe("unregistered");
      expect(result.monthsLeft).toBeNull();
    },
  );

  it("어떤 경우에도 ok 로 폴백하지 않는다", () => {
    expect(checkPassportExpiry(null, 출발일).status).not.toBe("ok");
  });
});

describe("checkPassportExpiry — 월말·윤년", () => {
  it("1/31 출발 + 7/31 만료는 통과한다", () => {
    expect(checkPassportExpiry("2026-07-31", "2026-01-31").status).toBe("ok");
  });

  it("윤년 2/29 출발을 정상 처리한다", () => {
    const result = checkPassportExpiry("2028-08-29", "2028-02-29");
    expect(result.status).toBe("ok");
    expect(result.monthsLeft).toBe(6);
  });
});

describe("요건 상수", () => {
  it("6개월이다", () => {
    expect(PASSPORT_VALIDITY_MONTHS).toBe(6);
  });
});
