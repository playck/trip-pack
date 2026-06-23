import { useState, useCallback } from "react";
import { Button, VStack, HStack } from "@chakra-ui/react";
import { Sparkles, ClipboardList } from "lucide-react";
import { useSetAtom } from "jotai";
import { componentColors } from "@/shared/constants/colors";
import type { ChecklistTemplateWithCategories } from "@/features/packing/type";
import { packingCreateAtom } from "../store/packingCreateAtom";
import { templateToCheckList } from "../utils/templateToCheckList";
import TemplateStartSheet from "./TemplateStartSheet";

interface CreateStartActionsProps {
  templates: ChecklistTemplateWithCategories[];
  /** 생성 시작(LOADING 단계로 전환). startMode는 atom에 이미 반영된 뒤 호출된다. */
  onStart: () => void;
  /** 이전 단계로 이동 */
  onPrevious: () => void;
}

export default function CreateStartActions({
  templates,
  onStart,
  onPrevious,
}: CreateStartActionsProps) {
  const setPackingState = useSetAtom(packingCreateAtom);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleStartAuto = useCallback(() => {
    setPackingState((prev) => ({
      ...prev,
      startMode: "auto",
      generatedCheckList: undefined,
    }));
    onStart();
  }, [setPackingState, onStart]);

  const handleSelectTemplate = useCallback(
    (template: ChecklistTemplateWithCategories) => {
      setPackingState((prev) => ({
        ...prev,
        startMode: "template",
        generatedCheckList: templateToCheckList(
          template.template_categories ?? [],
        ),
      }));
      setIsSheetOpen(false);
      onStart();
    },
    [setPackingState, onStart],
  );

  return (
    <VStack
      width="100%"
      maxWidth="600px"
      px={4}
      pt={3}
      pb={8}
      gap={3}
      position="fixed"
      bottom={0}
      left="50%"
      transform="translateX(-50%)"
      bg="bg"
      borderTop="1px solid"
      borderColor="border"
      zIndex={10}
    >
      {/* 내 체크리스트로 시작 */}
      <Button
        variant="outline"
        colorPalette={componentColors.button.primary}
        size="lg"
        width="100%"
        onClick={() => setIsSheetOpen(true)}
      >
        <ClipboardList size={18} />내 체크리스트로 시작
      </Button>

      {/* 이전 + 메인(추천으로 만들기) */}
      <HStack width="100%" gap={3}>
        <Button
          variant="outline"
          colorPalette={componentColors.button.ghost}
          size="lg"
          flex={1}
          onClick={onPrevious}
        >
          이전
        </Button>
        <Button
          colorPalette={componentColors.button.primary}
          size="lg"
          flex={1}
          onClick={handleStartAuto}
        >
          <Sparkles size={18} />
          추천으로 만들기
        </Button>
      </HStack>

      <TemplateStartSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        templates={templates}
        onSelect={handleSelectTemplate}
      />
    </VStack>
  );
}
