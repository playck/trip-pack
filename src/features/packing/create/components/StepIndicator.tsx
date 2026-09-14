import { Steps } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { ReactNode } from "react";

interface StepIndicatorProps {
  count?: number;
  currentStep?: number;
  icons?: ReactNode[];
  renderContent?: (index: number) => ReactNode;
  completedContent?: ReactNode;
  // 단계 수가 아직 확정되지 않았을 때 목록을 감춘다.
  isListHidden?: boolean;
}

export default function StepIndicator({
  count = 1,
  currentStep = 0,
  icons,
  renderContent,
  completedContent,
  isListHidden = false,
}: StepIndicatorProps) {
  const steps = Array.from({ length: count });

  return (
    <Steps.Root step={currentStep} count={count}>
      <Steps.List visibility={isListHidden ? "hidden" : "visible"}>
        {steps.map((_, index) => (
          <Steps.Item
            key={index}
            index={index}
            colorPalette={colors.primary.palette}
            gap={0}
          >
            <Steps.Indicator>{icons?.[index]}</Steps.Indicator>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((_, index) => (
        <Steps.Content key={index} index={index}>
          {renderContent ? renderContent(index) : null}
        </Steps.Content>
      ))}

      <Steps.CompletedContent>{completedContent}</Steps.CompletedContent>
    </Steps.Root>
  );
}
