import { Button, HStack } from "@chakra-ui/react";

import { componentColors } from "@/shared/constants/colors";
import { Step, LAST_STEP, type StepValue } from "../constants";

interface StepBtnContainerProps {
  currentStep: StepValue;
  totalSteps: number;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function StepBtnContainer({
  currentStep,
  isPreviousDisabled = false,
  isNextDisabled = false,
  onPrevious,
  onNext,
}: StepBtnContainerProps) {
  const isFirstStep = currentStep === Step.REGION;
  const isLastStep = currentStep === LAST_STEP;

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
