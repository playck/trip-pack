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
 * 성향 질문 앞까지의 고정 순서. `LAST_STEP` 같은 상수를 두지 않는 이유는
 * 단계 수가 4/5로 달라져 `step + 1` 인덱스 산술이 성립하지 않기 때문.
 */
export const BASE_STEPS: StepValue[] = [
  Step.REGION,
  Step.DATE,
  Step.COMPANION,
  Step.TRIP_TYPE,
];
