import { Steps } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { ReactNode } from "react";

interface StepIndicatorProps {
  count?: number;
  currentStep?: number;
  renderContent?: (index: number) => ReactNode;
  completedContent?: ReactNode;
}

export default function StepIndicator({
  count = 1,
  currentStep = 0,
  renderContent,
  completedContent,
}: StepIndicatorProps) {
  const steps = Array.from({ length: count });

  return (
    <Steps.Root step={currentStep} count={count}>
      <Steps.List>
        {steps.map((_, index) => (
          <Steps.Item
            key={index}
            index={index}
            colorPalette={colors.primary.palette}
            ml={index !== 0 ? 3 : 0}
          >
            <Steps.Indicator />
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((_, index) => (
        <Steps.Content key={index} index={index}>
          {renderContent ? renderContent(index) : null}
        </Steps.Content>
      ))}

      <Steps.CompletedContent>
        {completedContent ?? "All steps are complete!"}
      </Steps.CompletedContent>
    </Steps.Root>
  );
}
