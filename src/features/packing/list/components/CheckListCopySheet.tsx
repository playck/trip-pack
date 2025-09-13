import { useState } from "react";
import {
  VStack,
  Text,
  Button,
  Textarea,
  HStack,
  SegmentGroup,
  Box,
} from "@chakra-ui/react";
import { Copy, Check } from "lucide-react";

import type { CategoryWithItems } from "../../type";
import {
  exportChecklistToText,
  exportChecklistToDetailedText,
  copyToClipboard,
} from "../utils/checkListExport";

interface CheckListCopySheetProps {
  categories: CategoryWithItems[];
  onClose: () => void;
}

type ExportFormat = "simple" | "detailed";

export default function CheckListCopySheet({
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
    <VStack gap={4} align="stretch" p={4}>
      <Text fontSize="lg" fontWeight="semibold" color="gray.800">
        체크리스트 텍스트 추출
      </Text>

      <Box>
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
                label: "간단 형식",
              },
              {
                value: "detailed",
                label: "상세 형식",
              },
            ]}
          />
        </SegmentGroup.Root>
      </Box>

      <Box>
        <Text fontSize="sm" color="gray.600" mb={2}>
          미리보기
        </Text>
        <Textarea
          value={textContent}
          readOnly
          minH="200px"
          maxH="300px"
          fontSize="sm"
          bg="gray.50"
          borderColor="gray.200"
          _focus={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
        />
      </Box>

      <HStack gap={3}>
        <Button
          flex={1}
          colorScheme={isCopied ? "green" : "blue"}
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
  );
}
