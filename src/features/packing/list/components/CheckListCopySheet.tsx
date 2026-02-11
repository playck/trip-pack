import { useState } from "react";
import {
  VStack,
  Text,
  Button,
  Textarea,
  HStack,
  SegmentGroup,
} from "@chakra-ui/react";
import { Copy, Check } from "lucide-react";

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

  const handleCopy = async () => {
    const success = await copyToClipboard(textContent);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <VStack gap={3} align="stretch" pt={4.5} pb={3} px={3}>
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
          minH="300px"
          fontSize="sm"
          bg="gray.50"
          borderColor="gray.200"
        />

        <HStack gap={3}>
          <Button
            flex={1}
            colorPalette={
              isCopied ? statusColors.success.palette : colors.primary.palette
            }
            onClick={handleCopy}
            disabled={isCopied}
          >
            <HStack gap={2}>
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              <Text>{isCopied ? "복사됨!" : "복사"}</Text>
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
