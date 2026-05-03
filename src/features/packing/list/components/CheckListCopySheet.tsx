import { useState } from "react";
import {
  VStack,
  Text,
  Button,
  Textarea,
  HStack,
  SegmentGroup,
} from "@chakra-ui/react";
import { Share2, Check } from "lucide-react";

import { colors, statusColors } from "@/shared/constants/colors";
import { BottomSheet } from "@/shared/components";
import type { CategoryWithItems } from "../../type";
import {
  exportChecklistToText,
  exportChecklistToDetailedText,
} from "../utils/checkListExport";
import { copyToClipboard } from "@/shared/utiles/clipboard";

interface CheckListCopySheetProps {
  isOpen: boolean;
  categories: CategoryWithItems[];
  onClose: () => void;
}

type ExportFormat = "simple" | "detailed";

export default function CheckListCopySheet({
  isOpen,
  categories,
  onClose,
}: CheckListCopySheetProps) {
  const [format, setFormat] = useState<ExportFormat>("simple");
  const [isCopied, setIsCopied] = useState(false);

  const textContent =
    format === "detailed"
      ? exportChecklistToDetailedText(categories)
      : exportChecklistToText(categories);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: textContent });
      } catch {
        // 사용자가 공유 취소한 경우 무시
      }
    } else {
      // Share API 미지원 시 클립보드 복사 폴백
      const success = await copyToClipboard(textContent);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} expanded>
      <VStack gap={3} align="stretch" pt={4.5} pb={3} px={3} flex={1}>
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold" color="gray.800">
            체크리스트 공유
          </Text>

          <>
            <SegmentGroup.Root
              size="sm"
              value={format}
              onValueChange={(details) => {
                if (details.value) {
                  setFormat(details.value as ExportFormat);
                }
              }}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items
                items={[
                  {
                    value: "simple",
                    label: "간단",
                  },
                  {
                    value: "detailed",
                    label: "상세",
                  },
                ]}
              />
            </SegmentGroup.Root>
          </>
        </HStack>

        <Textarea
          value={textContent}
          readOnly
          flex={1}
          fontSize="sm"
          bg="gray.50"
          borderColor="gray.200"
        />

        <HStack gap={3} mt="auto">
          <Button
            flex={1}
            colorPalette={
              isCopied ? statusColors.success.palette : colors.primary.palette
            }
            onClick={handleShare}
            disabled={isCopied}
          >
            <HStack gap={2}>
              {isCopied ? <Check size={16} /> : <Share2 size={16} />}
              <Text>{isCopied ? "복사됨!" : "공유"}</Text>
            </HStack>
          </Button>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </HStack>
      </VStack>
    </BottomSheet>
  );
}
