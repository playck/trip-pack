import type { ReactNode } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";

import { borderColors, colors, textColors } from "@/shared/constants/colors";

/** 값의 성격. 색은 조치가 필요할 때(attention)만 붙는다 */
type ValueTone = "default" | "attention" | "muted";

const TONE_STYLE: Record<ValueTone, { color: string; fontWeight: string }> = {
  default: { color: textColors.primary, fontWeight: "semibold" },
  attention: { color: "orange.700", fontWeight: "semibold" },
  muted: { color: textColors.muted, fontWeight: "medium" },
};

interface RequirementValueProps {
  text: string;
  tone?: ValueTone;
  /** 값 앞에 붙는 짧은 출처 표시 (예: 항공사 IATA 코드). 숫자가 시선의 기준이 되도록 흐리게 */
  prefix?: string;
  /** 조치가 필요한 항목에만 붙이는 배지 (예: 입국신고 필수) */
  badge?: string;
  detail?: string | null;
}

/** 리드아웃 행의 값 영역 — 짧은 상태값 + 선택적 배지·보조 설명 */
export function RequirementValue({
  text,
  tone = "default",
  prefix,
  badge,
  detail,
}: RequirementValueProps) {
  const { color, fontWeight } = TONE_STYLE[tone];

  return (
    <VStack align="stretch" gap={0.5}>
      <HStack gap={1.5} align="baseline" flexWrap="wrap">
        {prefix && (
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={textColors.muted}
            flexShrink={0}
          >
            {prefix}
          </Text>
        )}
        <Text
          fontSize="sm"
          fontWeight={fontWeight}
          color={color}
          letterSpacing="-0.01em"
        >
          {text}
        </Text>
        {badge && (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="orange.700"
            bg="orange.50"
            borderWidth="1px"
            borderColor="orange.200"
            borderRadius="sm"
            px={1.5}
            flexShrink={0}
          >
            {badge}
          </Text>
        )}
      </HStack>
      {detail && (
        <Text
          fontSize="xs"
          color={textColors.muted}
          lineHeight="1.5"
          lineClamp={2}
        >
          {detail}
        </Text>
      )}
    </VStack>
  );
}

interface RequirementRowProps {
  /** 좌측 키 컬럼. 앞 행과 같은 항목이 이어지면 비워 둔다 */
  label?: string;
  onClick: () => void;
  children: ReactNode;
}

/** 스펙시트형 참조 행 — 라벨(키) + 값 + 이동 셰브론 */
export default function RequirementRow({
  label,
  onClick,
  children,
}: RequirementRowProps) {
  return (
    <HStack
      as="button"
      onClick={onClick}
      w="100%"
      gap={2.5}
      px={3}
      py={2.5}
      align="start"
      textAlign="left"
      cursor="pointer"
      transition="background 0.12s ease"
      _notFirst={{
        borderTopWidth: "1px",
        borderTopColor: borderColors.subtle,
      }}
      _active={{ bg: "gray.100" }}
      _focusVisible={{
        outline: "2px solid",
        outlineColor: `${colors.primary.palette}.500`,
        outlineOffset: "-2px",
      }}
    >
      <Text
        fontSize="xs"
        color={textColors.muted}
        w="52px"
        flexShrink={0}
        lineHeight="1.7"
      >
        {label}
      </Text>

      <Box flex={1} minW={0}>
        {children}
      </Box>

      <Box color={borderColors.emphasized} flexShrink={0} mt="3px">
        <ChevronRight size={14} />
      </Box>
    </HStack>
  );
}
