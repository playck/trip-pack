export type CompanionType = "alone" | "withCompanion";

export type CompanionTypeOption =
  | "친구"
  | "연인"
  | "배우자"
  | "부모님"
  | "아기"
  | "아이"
  | "가족"
  | "반려동물"
  | "기타";

export const COMPANION_TYPE_OPTIONS: CompanionTypeOption[] = [
  "친구",
  "연인",
  "배우자",
  "부모님",
  "아기",
  "아이",
  "가족",
  "반려동물",
  "기타",
];

export type TripTypeOption =
  | "미식"
  | "자연"
  | "관광"
  | "출장"
  | "액티비티"
  | "휴양"
  | "쇼핑"
  | "운동"
  | "수영";

export const TRIP_TYPE_OPTIONS: TripTypeOption[] = [
  "미식",
  "자연",
  "관광",
  "출장",
  "액티비티",
  "휴양",
  "쇼핑",
  "운동",
  "수영",
];

/**
 * 화면에 보이는 이름. 값(TripTypeOption)은 trips.trip_types 로 DB 에 저장되므로
 * 바꿀 수 없고, 레이블만 분리해 선택지와 결과를 일치시킨다.
 *
 * `미식` 은 "맛집을 다니겠다"로 읽히는데 실제로 붙는 건 한식 준비물(컵라면·즉석밥·
 * 김치…)이라 의도와 결과가 어긋났다. 레이블을 결과에 맞춘다.
 */
export const TRIP_TYPE_LABELS: Record<TripTypeOption, string> = {
  미식: "한식 챙기기",
  자연: "자연",
  관광: "관광",
  출장: "출장",
  액티비티: "액티비티",
  휴양: "휴양",
  쇼핑: "쇼핑",
  운동: "운동",
  수영: "수영",
};

export const TRIP_TYPE_ICONS: Record<TripTypeOption, string> = {
  미식: "🍽️",
  자연: "🌿",
  관광: "📸",
  출장: "💼",
  액티비티: "🏄",
  휴양: "🏖️",
  쇼핑: "🛍️",
  운동: "💪",
  수영: "🏊",
};
