import { HStack, Text } from "@chakra-ui/react";
import { CircleAlert } from "lucide-react";
import { useAtomValue } from "jotai";

import { statusColors } from "@/shared/constants/colors";
import { findEssentialGuide } from "@/shared/data/essentialItemGuides";
import { passportExpiryAtom } from "@/shared/store/passportStore";
import {
  checkPassportExpiry,
  PASSPORT_VALIDITY_MONTHS,
} from "@/shared/utiles/passportExpiry";

interface PassportExpiryPillProps {
  itemName: string;
  /** 판정 기준일 = 여행 출발일. 없으면 판정하지 않는다 */
  startDate?: string | null;
}

/**
 * 여권 아이템 옆 잔여 유효기간 경고.
 *
 * 이름을 정확히 비교하지 않고 가이드 매칭으로 판정한다 — 사용자가 "여권(엄마)"
 * 처럼 바꿔도 따라간다. 미등록이면 조용히 있는다(등록 유도는 마이페이지에서만).
 */
export default function PassportExpiryPill({
  itemName,
  startDate,
}: PassportExpiryPillProps) {
  const expiryDate = useAtomValue(passportExpiryAtom);

  if (findEssentialGuide(itemName)?.key !== "passport") return null;
  if (!startDate) return null;

  const { status, monthsLeft } = checkPassportExpiry(expiryDate, startDate);
  if (status === "ok" || status === "unregistered") return null;

  return (
    <HStack
      gap={0.5}
      px={1.5}
      py={0.5}
      borderRadius="full"
      bg="orange.50"
      borderWidth="1px"
      borderColor="orange.200"
      color={statusColors.warning.text}
      flexShrink={0}
    >
      <CircleAlert size={12} />
      <Text fontSize="2xs" fontWeight="semibold" whiteSpace="nowrap">
        {status === "expired"
          ? "출발 전 만료"
          : `${monthsLeft}개월 · ${PASSPORT_VALIDITY_MONTHS}개월 미만`}
      </Text>
    </HStack>
  );
}
