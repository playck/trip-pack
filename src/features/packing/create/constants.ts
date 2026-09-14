/**
 * Packing Create 기능의 상수들
 */

export const Step = {
  REGION: 0,
  DATE: 1,
  COMPANION: 2,
  TRIP_TYPE: 3,
  STYLE: 4,
  LOADING: 5,
} as const;

export type StepValue = (typeof Step)[keyof typeof Step];

/**
 * 성향 질문 앞까지의 고정 순서.
 *
 * `LAST_STEP` 같은 고정 상수를 두지 않는다 — 단계 수가 성향을 물었는지에 따라
 * 4개/5개로 달라지므로 `step + 1` 같은 인덱스 산술이 성립하지 않는다.
 * 화면 순서는 PackingCreatePage 에서 배열로 조립하고 이동은 인덱스로 한다.
 */
export const BASE_STEPS: StepValue[] = [
  Step.REGION,
  Step.DATE,
  Step.COMPANION,
  Step.TRIP_TYPE,
];
