// src/constants/colors.ts
// 시맨틱 토큰 기반 프로젝트 색상 관리

/**
 * 🎨 프로젝트 색상 시스템
 * Chakra UI 시맨틱 토큰을 활용한 색상 관리
 * Primary Color: Teal 🟢
 */

// 기본 시스템 색상 (시맨틱 토큰 활용)
export const systemColors = {
  background: {
    primary: "bg", // 메인 배경
    secondary: "bg.subtle", // 서브 배경
    muted: "bg.muted", // 음소거 배경
    emphasized: "bg.emphasized", // 강조 배경
    panel: "bg.panel", // 패널 배경
  },

  text: {
    primary: "fg", // 메인 텍스트
    secondary: "fg.muted", // 보조 텍스트
    subtle: "fg.subtle", // 미묘한 텍스트
    inverted: "fg.inverted", // 반전 텍스트
  },

  border: {
    default: "border",
    subtle: "border.subtle",
    emphasized: "border.emphasized",
    muted: "border.muted",
  },
} as const;

// 상태별 색상 (시맨틱 토큰 활용)
export const statusColors = {
  success: {
    bg: "bg.success",
    text: "fg.success",
    border: "border.success",
    solid: "green.solid",
    contrast: "green.contrast",
    palette: "green",
  },

  warning: {
    bg: "bg.warning",
    text: "fg.warning",
    border: "border.warning",
    solid: "orange.solid",
    contrast: "orange.contrast",
    palette: "orange",
  },

  error: {
    bg: "bg.error",
    text: "fg.error",
    border: "border.error",
    solid: "red.solid",
    contrast: "red.contrast",
    palette: "red",
  },

  info: {
    bg: "bg.info",
    text: "fg.info",
    border: "border.info",
    solid: "blue.solid",
    contrast: "blue.contrast",
    palette: "blue",
  },
} as const;

// 브랜드 색상 (프로젝트 고유) - Teal Primary 🟢
export const colors = {
  primary: {
    palette: "teal", // colorPalette prop에 사용
    solid: "teal.solid",
    contrast: "teal.contrast",
    subtle: "teal.subtle",
    muted: "teal.muted",
    emphasized: "teal.emphasized",
    fg: "teal.fg",
    focusRing: "teal.focusRing",
  },

  secondary: {
    palette: "cyan",
    solid: "cyan.solid",
    contrast: "cyan.contrast",
    subtle: "cyan.subtle",
    muted: "cyan.muted",
    emphasized: "cyan.emphasized",
    fg: "cyan.fg",
  },

  accent: {
    palette: "purple",
    solid: "purple.solid",
    contrast: "purple.contrast",
    subtle: "purple.subtle",
    muted: "purple.muted",
    emphasized: "purple.emphasized",
    fg: "purple.fg",
  },

  neutral: {
    palette: "gray",
    solid: "gray.solid",
    contrast: "gray.contrast",
    subtle: "gray.subtle",
    muted: "gray.muted",
    emphasized: "gray.emphasized",
    fg: "gray.fg",
  },
} as const;

// 컴포넌트별 색상 규칙
export const componentColors = {
  // 카드 컴포넌트
  card: {
    background: systemColors.background.panel,
    border: systemColors.border.default,
    text: systemColors.text.primary,
    textMuted: systemColors.text.secondary,
    shadow: "md",
  },

  // 버튼 컴포넌트
  button: {
    primary: colors.primary.palette, // teal
    secondary: colors.secondary.palette, // cyan
    accent: colors.accent.palette, // purple
    danger: statusColors.error.palette, // red
    success: statusColors.success.palette, // green
    ghost: colors.neutral.palette, // gray
  },

  // Alert 컴포넌트
  alert: {
    success: statusColors.success,
    warning: statusColors.warning,
    error: statusColors.error,
    info: statusColors.info,
  },
} as const;

// 색상 조합 헬퍼 (자주 사용하는 조합들)
export const colorCombinations = {
  // 메인 브랜드 조합
  primaryBrand: {
    background: colors.primary.subtle,
    text: colors.primary.fg,
    border: colors.primary.muted,
    accent: colors.primary.solid,
  },

  // 카드 기본 조합
  defaultCard: {
    background: systemColors.background.panel,
    text: systemColors.text.primary,
    textMuted: systemColors.text.secondary,
    border: systemColors.border.default,
  },

  // 강조 카드 조합
  accentCard: {
    background: colors.primary.subtle,
    text: colors.primary.fg,
    border: colors.primary.muted,
    accent: colors.primary.solid,
  },
} as const;

// 타입 정의
export type SystemColors = typeof systemColors;
export type StatusColors = typeof statusColors;
export type Colors = typeof colors;
export type ComponentColors = typeof componentColors;
export type ColorCombinations = typeof colorCombinations;
