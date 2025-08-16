/**
 * Packing Create 기능의 상수들
 */

export const Step = {
  REGION: 0,
  DATE: 1,
  COMPANION: 2,
  TRIP_TYPE: 3,
} as const;

export type StepValue = (typeof Step)[keyof typeof Step];

export const LAST_STEP = Step.TRIP_TYPE;
