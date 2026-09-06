import { useMemo, useState } from "react";
import {
  VStack,
  Text,
  Textarea,
  HStack,
  Box,
  Badge,
  Button,
} from "@chakra-ui/react";
import { ClipboardPaste, CheckCircle2, HelpCircle } from "lucide-react";
import BottomSheet from "@/shared/components/BottomSheet";
import Modal from "@/shared/components/Modal";
import { useCreateCategoriesFromCheckList } from "@/features/packing/list/hooks/useCreateCategoriesFromCheckList";
import type { CategoryWithItems } from "@/features/packing/type";
import {
  parseChecklistFromText,
  type ParsedCategory,
} from "../utils/parseChecklistText";
import { CATEGORY_ICONS } from "../constants/category";
import type { CategoryWithType } from "./CheckListBottomSheet";

type SectionType = "packing" | "shopping" | "todo";

interface ImportTextSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  defaultType?: SectionType;
}

const SECTION_LABEL: Record<SectionType, string> = {
  packing: "준비물",
  shopping: "쇼핑",
  todo: "할일",
};

const MAX_LENGTH = 3000;

const EXAMPLES = [
  {
    label: "단순 목록",
    text: `- 여권
- 충전기
- 선크림
- 수영복
- 양말 5켤레`,
  },
  {
    label: "카테고리 구분",
    text: `[의류]
- 반팔 3벌
- 긴바지
- 잠옷

[세면용품]
- 칫솔
- 치약
- 폼클렌징`,
  },
  {
    label: "메모 포함",
    text: `## 필수
- 여권 (유효기간 확인)
- 비자
- 보험증서

## 전자제품
- 보조배터리 2개
- 멀티어댑터`,
  },
];

const FALLBACK_ICON_KEY = "기타용품";

function toCategoryWithType(
  parsed: ParsedCategory,
  sectionType: SectionType,
): CategoryWithType {
  const iconKey = CATEGORY_ICONS[parsed.categoryName]
    ? parsed.categoryName
    : FALLBACK_ICON_KEY;
  const categoryId = crypto.randomUUID();
  const items: CategoryWithItems["items"] = parsed.items.map((item) => ({
    id: crypto.randomUUID(),
    name: item.name,
    notes: item.notes ?? null,
    is_required: false,
    is_checked: false,
    display_order: 0,
    category_id: categoryId,
    cabin_notes: null,
    cabin_policy: null,
    created_at: null,
    updated_at: null,
  }));

  return {
    id: categoryId,
    name: parsed.categoryName,
    icon_key: iconKey,
    display_order: 0,
    created_at: null,
    // 아직 저장 전인 미리보기 객체라 실제 행이 아니다. created_by 와 같은 방식으로 빈 값을 둔다
    trip_id: "",
    created_by: "",
    category_type: sectionType,
    items,
  };
}

export default function ImportTextSheet({
  isOpen,
  onClose,
  tripId,
  defaultType = "packing",
}: ImportTextSheetProps) {
  const sectionLabel = SECTION_LABEL[defaultType];
  const [text, setText] = useState("");
  const [previewData, setPreviewData] = useState<ParsedCategory[] | null>(null);
  const [parseError, setParseError] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const createCategories = useCreateCategoriesFromCheckList(tripId, {
    onSuccess: (result) => {
      // 부분 실패/전부 스킵된 경우엔 사용자가 결과를 검토할 수 있도록 시트 유지
      const allSucceeded =
        result.failedCategories.length === 0 &&
        result.skippedCategories.length === 0;
      if (allSucceeded) handleClose();
    },
  });

  const handleParse = () => {
    const result = parseChecklistFromText(text);
    if (result.length === 0) {
      setParseError(true);
      return;
    }
    setParseError(false);
    setPreviewData(result);
  };

  const handleConfirm = () => {
    if (!previewData) return;
    const payload = previewData.map((p) => toCategoryWithType(p, defaultType));
    createCategories.mutate(payload);
  };

  const handleClose = () => {
    setText("");
    setPreviewData(null);
    setParseError(false);
    setShowExamples(false);
    onClose();
  };

  const handleBack = () => {
    setPreviewData(null);
  };

  const handleExampleClick = (exampleText: string) => {
    setText(exampleText);
    setParseError(false);
    setShowExamples(false);
  };

  const totalItems = useMemo(
    () => previewData?.reduce((sum, cat) => sum + cat.items.length, 0) ?? 0,
    [previewData],
  );

  // ── 미리보기 ──
  if (previewData) {
    return (
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        onBack={handleBack}
        title={`${sectionLabel} 추가 - 변환 결과`}
        size="max"
        primaryButton={{
          text: "이 목록으로 추가하기",
          onClick: handleConfirm,
          isLoading: createCategories.isPending,
          disabled: createCategories.isPending,
        }}
        secondaryButton={{
          text: "다시 입력",
          onClick: handleBack,
          disabled: createCategories.isPending,
        }}
      >
        <VStack gap={3} px={4} pb={4} align="stretch">
          <HStack gap={2}>
            <CheckCircle2 size={16} color="green" />
            <Text fontSize="sm" color="gray.600">
              {previewData.length}개 카테고리, {totalItems}개 아이템
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            동일한 이름의 카테고리가 이미 있다면 자동으로 건너뜁니다.
          </Text>

          <VStack
            gap={3}
            align="stretch"
            maxH="55vh"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#ddd",
                borderRadius: "4px",
              },
            }}
          >
            {previewData.map((category, idx) => (
              <Box
                key={`${category.categoryName}-${idx}`}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                p={3}
              >
                <HStack gap={2} mb={2}>
                  <Text fontSize="sm" fontWeight="semibold">
                    {category.categoryName}
                  </Text>
                  <Badge size="sm" variant="subtle" colorPalette="gray">
                    {category.items.length}
                  </Badge>
                </HStack>
                <VStack gap={1} align="stretch">
                  {category.items.map((item, itemIdx) => (
                    <HStack
                      key={`${category.categoryName}-${item.name}-${itemIdx}`}
                      gap={2}
                      pl={1}
                    >
                      <Box
                        w="5px"
                        h="5px"
                        borderRadius="full"
                        bg="gray.400"
                        flexShrink={0}
                      />
                      <Text fontSize="sm" color="gray.700">
                        {item.name}
                      </Text>
                      {item.notes && (
                        <Text fontSize="xs" color="gray.400">
                          {item.notes}
                        </Text>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </VStack>
      </BottomSheet>
    );
  }

  // ── 입력 ──
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={`${sectionLabel} 추가`}
      size="max"
      closeOnInteractOutside={!showExamples}
      primaryButton={{
        text: "변환하기",
        onClick: handleParse,
        disabled: text.trim().length === 0,
      }}
      secondaryButton={{
        text: "취소",
        onClick: handleClose,
      }}
    >
      <VStack gap={3} px={4} pb={0} align="stretch" flex={1}>
        <HStack justify="space-between" align="center">
          <HStack gap={2} color="gray.500">
            <ClipboardPaste size={16} />
            <Text fontSize="sm">텍스트로 정리된 준비물 목록을 넣어주세요</Text>
          </HStack>
          <Button
            variant="ghost"
            size="xs"
            color="teal.500"
            onClick={() => setShowExamples(true)}
          >
            <HelpCircle size={14} />
            작성 예시
          </Button>
        </HStack>

        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setParseError(false);
          }}
          placeholder="준비물 목록을 붙여넣거나 직접 입력하세요"
          flex={1}
          minH="40vh"
          resize="none"
          fontSize="sm"
          borderRadius="lg"
          maxLength={MAX_LENGTH}
          autoFocus
        />

        {parseError && (
          <Text fontSize="xs" color="red.500">
            인식할 수 있는 항목이 없습니다. 아래 예시를 참고해주세요.
          </Text>
        )}

        <HStack justify="flex-end">
          <Text
            fontSize="xs"
            color={text.length >= MAX_LENGTH ? "red.500" : "gray.400"}
          >
            {text.length}/{MAX_LENGTH}
          </Text>
        </HStack>

        <Modal
          isOpen={showExamples}
          onClose={() => setShowExamples(false)}
          title="작성 예시"
          size="sm"
        >
          <VStack gap={3} align="stretch" maxH="50vh" overflowY="auto">
            <Text fontSize="xs" color="gray.500">
              탭하면 입력창에 자동으로 채워집니다
            </Text>
            {EXAMPLES.map((ex) => (
              <Box
                key={ex.label}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                p={3}
                cursor="pointer"
                bg="gray.50"
                _hover={{ borderColor: "teal.300", bg: "teal.50" }}
                onClick={() => handleExampleClick(ex.text)}
              >
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="teal.600"
                  mb={2}
                >
                  {ex.label}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  whiteSpace="pre-line"
                  lineHeight="1.6"
                >
                  {ex.text}
                </Text>
              </Box>
            ))}
          </VStack>
        </Modal>
      </VStack>
    </BottomSheet>
  );
}
