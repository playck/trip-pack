import { useMemo } from "react";
import { Box, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { ChevronRight, CircleAlert } from "lucide-react";

import { Info } from "@/shared/components";
import {
  getEntryDeclaration,
  isDeclarationWindowOpen,
} from "@/shared/data/entryDeclarations";
import {
  ENTRY_DECLARATION_GUIDE_KEY,
  ESSENTIAL_CATEGORY_NAME,
  findEssentialGuide,
} from "@/shared/data/essentialItemGuides";

import {
  useTripChecklist,
  useUpdateItemCheckedStatus,
} from "../hooks/useTripChecklist";
import { getTripCountdown } from "../utils/tripCountdown";
import EssentialItemGuideSheet from "./EssentialItemGuideSheet";

interface EntryDeclarationBannerProps {
  tripId: string;
  countryCode?: string | null;
  startDate: string;
  endDate: string;
}

/**
 * 전자 입국신고 작성 기간 배너.
 * 작성 창이 열렸고 체크리스트의 입국신고 아이템이 미체크일 때만 노출한다.
 */
export default function EntryDeclarationBanner({
  tripId,
  countryCode,
  startDate,
  endDate,
}: EntryDeclarationBannerProps) {
  // 짐 목록과 같은 쿼리 키라 캐시를 공유한다 (추가 조회 없음)
  const { categories } = useTripChecklist(tripId);
  const updateItemStatus = useUpdateItemCheckedStatus(tripId);
  const guideSheet = useDisclosure();

  const declaration = useMemo(
    () => getEntryDeclaration(countryCode),
    [countryCode],
  );

  // 이름을 바꿔도 찾도록 정확 일치 대신 가이드 매칭으로 판정(가이드 pill과 동일 기준)
  const declarationItem = useMemo(() => {
    if (!declaration) return null;
    const essential = categories.find(
      (category) => category.name === ESSENTIAL_CATEGORY_NAME,
    );
    return (
      essential?.items?.find(
        (item) =>
          findEssentialGuide(item.name)?.key === ENTRY_DECLARATION_GUIDE_KEY,
      ) ?? null
    );
  }, [categories, declaration]);

  const { daysUntilTrip, daysUntilTripEnd } = getTripCountdown(
    startDate,
    endDate,
  );

  const showBanner =
    !!declaration &&
    !!declarationItem &&
    !declarationItem.is_checked &&
    isDeclarationWindowOpen(declaration, daysUntilTrip, daysUntilTripEnd);

  return (
    <>
      {showBanner && declaration && (
        <Info
          as="button"
          colorScheme="orange"
          textAlign="left"
          cursor="pointer"
          onClick={guideSheet.onOpen}
        >
          <HStack justify="space-between">
            <HStack gap={1.5} align="start">
              <Box color="orange.500" mt="1px">
                <CircleAlert size={15} />
              </Box>
              <VStack align="start" gap={0}>
                <Text fontSize="xs" fontWeight="bold" color="orange.700">
                  {declaration.name} 작성 가능 기간이에요
                </Text>
                <Text fontSize="2xs" color="orange.600">
                  {declaration.deadline} · 도착 전 필수
                </Text>
              </VStack>
            </HStack>
            <Box color="orange.300">
              <ChevronRight size={14} />
            </Box>
          </HStack>
        </Info>
      )}

      <EssentialItemGuideSheet
        isOpen={guideSheet.open}
        onClose={guideSheet.onClose}
        item={declarationItem}
        countryCode={countryCode}
        onToggleCheck={(itemId, isChecked) =>
          updateItemStatus.mutate({ itemId, isChecked })
        }
      />
    </>
  );
}
