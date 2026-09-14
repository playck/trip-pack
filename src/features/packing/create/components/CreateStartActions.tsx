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
  /**
   * 추천으로 만들기. **다음 단계로 진행**한다(성향 질문이 남아 있으면 그 화면).
   * 여기서 곧바로 생성을 시작하면 성향 질문을 건너뛰게 된다.
   */
  onStartAuto: () => void;
  /**
   * 템플릿으로 시작. 생성(LOADING)으로 직행한다.
   * 템플릿 경로는 generateCheckList 를 타지 않아 성향이 결과에 영향이 없다.
   */
  onStartTemplate: () => void;
  /** 이전 단계로 이동 */
  onPrevious: () => void;
  /** 성향 조회가 끝나기 전엔 추천 생성을 막는다(기본값으로 만들어지는 것 방지). */
  isAutoDisabled?: boolean;
}

export default function CreateStartActions({
  templates,
  onStartAuto,
  onStartTemplate,
  onPrevious,
  isAutoDisabled = false,
}: CreateStartActionsProps) {
  const setPackingState = useSetAtom(packingCreateAtom);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleStartAuto = useCallback(() => {
    setPackingState((prev) => ({
      ...prev,
      startMode: "auto",
      generatedCheckList: undefined,
    }));
    onStartAuto();
  }, [setPackingState, onStartAuto]);

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
      onStartTemplate();
    },
    [setPackingState, onStartTemplate],
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
          disabled={isAutoDisabled}
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
