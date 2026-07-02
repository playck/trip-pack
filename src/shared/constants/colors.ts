// src/constants/colors.ts
// 시맨틱 토큰 기반 프로젝트 색상 관리

/**
 * 🎨 프로젝트 색상 시스템
 * Chakra UI 시맨틱 토큰을 활용한 색상 관리
 * Primary Color: Teal 🟢
 */

// 기본 시스템 색상
export const systemColors = {
  background: {
    primary: "white",
    secondary: "gray.50",
    muted: "gray.100",
    emphasized: "gray.200",
    panel: "white",
  },

  text: {
    primary: "gray.900",
    secondary: "gray.700",
    tertiary: "gray.600",
    muted: "gray.500",
    subtle: "gray.400",
  },

  border: {
    default: "gray.200",
    subtle: "gray.100",
    emphasized: "gray.300",
    muted: "gray.150",
  },
} as const;

// 커스텀 레드 계열 색상
export const customPalette = {
  rose: {
    50: "#FFF1F2",
    100: "#FFE4E6",
    200: "#FECDD3",
    300: "#FDA4AF",
    400: "#FB7185",
    500: "#F43F5E",
    600: "#E11D48",
    700: "#BE123C",
    800: "#9F1239",
    900: "#881337",
  },
} as const;

export const backgrounds = systemColors.background;
export const textColors = systemColors.text;
export const borderColors = systemColors.border;

// 상태별 색상
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
    bg: customPalette.rose[50],
    text: customPalette.rose[600],
    border: customPalette.rose[200],
    solid: customPalette.rose[500],
    contrast: "#FFFFFF",
    palette: "red",
    hex: {
      50: customPalette.rose[50],
      100: customPalette.rose[100],
      200: customPalette.rose[200],
      300: customPalette.rose[300],
      400: customPalette.rose[400],
      500: customPalette.rose[500],
      600: customPalette.rose[600],
    },
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

// Chakra Teal 팔레트 hex 값 (아이콘 등 직접 hex 필요한 곳에서 사용)
export const hexColors = {
  teal: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044",
  },
  gray: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923",
  },
} as const;

// 상태 배지용 hex 맵 (flight 운항 상태·주차 혼잡도 등 배지 계열에서 공용)
export const badgePalette = {
  positive: {
    bg: hexColors.teal[50],
    text: hexColors.teal[600],
    bar: hexColors.teal[400],
  },
  info: { bg: "#EBF8FF", text: "#2B6CB0", bar: "#4299E1" },
  caution: { bg: "#FFFBEB", text: "#D69E2E", bar: "#ED8936" },
  critical: {
    bg: customPalette.rose[50],
    text: customPalette.rose[600],
    bar: customPalette.rose[500],
  },
} as const;

// 브랜드 색상 (프로젝트 고유) - Teal Primary 🟢
export const colors = {
  primary: {
    palette: "teal",
    solid: "teal.solid",
    contrast: "teal.contrast",
    subtle: "teal.subtle",
    muted: "teal.muted",
    emphasized: "teal.emphasized",
    fg: "teal.fg",
    focusRing: "teal.focusRing",
    hex: hexColors.teal,
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
    hex: hexColors.gray,
  },
} as const;

// 컴포넌트별 색상 규칙
export const componentColors = {
  // 카드 컴포넌트
  card: {
    background: backgrounds.panel,
    border: borderColors.default,
    text: textColors.primary,
    textMuted: textColors.secondary,
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

    border: {
      default: borderColors.default,
      subtle: borderColors.subtle,
      muted: borderColors.muted,
    },
  },

  // Alert 컴포넌트
  alert: {
    success: statusColors.success,
    warning: statusColors.warning,
    error: statusColors.error,
    info: statusColors.info,
  },
} as const;

// 색상 조합 헬퍼
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
    background: backgrounds.panel,
    text: textColors.primary,
    textMuted: textColors.secondary,
    border: borderColors.default,
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
export type Backgrounds = typeof backgrounds;
export type TextColors = typeof textColors;
export type BorderColors = typeof borderColors;
export type StatusColors = typeof statusColors;
export type Colors = typeof colors;
export type ComponentColors = typeof componentColors;
export type ColorCombinations = typeof colorCombinations;
