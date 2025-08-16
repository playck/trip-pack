import { Button, HStack } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { componentColors } from "@/shared/constants/colors";

interface StepBtnContainerProps {
  currentStep: number;
  totalSteps: number;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function StepBtnContainer({
  currentStep,
  totalSteps,
  isPreviousDisabled = false,
  isNextDisabled = false,
  onPrevious,
  onNext,
}: StepBtnContainerProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <HStack
      justify="space-between"
      width="100%"
      maxWidth="600px"
      px={4}
      py={3}
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
      {/* 이전 버튼 영역 */}
      {!isFirstStep ? (
        <Button
          variant="outline"
          colorPalette={componentColors.button.ghost}
          size="lg"
          onClick={onPrevious}
          disabled={isPreviousDisabled}
          flex={1}
        >
          <ChevronLeft size={20} />
          이전
        </Button>
      ) : (
        <div />
      )}

      {/* 다음 버튼 영역 */}
      {!isLastStep ? (
        <Button
          colorPalette={componentColors.button.primary}
          size="lg"
          flex={1}
          ml="auto"
          disabled={isNextDisabled}
          onClick={onNext}
        >
          다음
          <ChevronRight size={20} />
        </Button>
      ) : (
        <Button
          colorPalette={componentColors.button.success}
          size="lg"
          flex={1}
          ml="auto"
          disabled={isNextDisabled}
          onClick={onNext}
        >
          완료
        </Button>
      )}
    </HStack>
  );
}
