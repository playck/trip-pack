import type { MouseEvent } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";

import { colors } from "@/shared/constants/colors";

interface EssentialGuideButtonProps {
  itemName: string;
  onClick: (e: MouseEvent) => void;
}

const primary = colors.primary.palette;

// 아이템별 가이드 진입점 임시 비노출 (2026-08-30) — 재노출 시 true 로 변경.
// 숨겨도 입국신고 배너 → 가이드 시트 경로는 그대로 동작한다.
const SHOW_ESSENTIAL_GUIDE_BUTTON: boolean = false;

/** 필수 준비물 아이템의 심화 가이드 진입 버튼 (pill) */
export default function EssentialGuideButton({
  itemName,
  onClick,
}: EssentialGuideButtonProps) {
  if (!SHOW_ESSENTIAL_GUIDE_BUTTON) return null;

  return (
    <HStack
      as="button"
      aria-label={`${itemName} 심화 가이드`}
      gap={0.5}
      px={1.5}
      py={0.5}
      borderRadius="full"
      bg={`${primary}.50`}
      borderWidth="1px"
      borderColor={`${primary}.200`}
      color={`${primary}.600`}
      flexShrink={0}
      cursor="pointer"
      onClick={onClick}
    >
      <BookOpen size={12} />
      <Text fontSize="2xs" fontWeight="semibold">
        가이드
      </Text>
    </HStack>
  );
}
