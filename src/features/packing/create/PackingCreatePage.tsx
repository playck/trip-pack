import { useState, useCallback, useEffect } from "react";
import { Container } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";

import { MapPin, Calendar, Users, Luggage } from "lucide-react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useChecklistTemplate } from "@/features/packing/template/hooks";
import type { ChecklistTemplateWithCategories } from "@/features/packing/type";
import {
  packingCreateValidationAtom,
  packingCreateAtom,
  INITIAL_PACKING_CREATE_STATE,
} from "./store/packingCreateAtom";
import {
  StepIndicator,
  SearchRegionComboBox,
  StepBtnContainer,
  SearchCalendar,
  TravelCompanion,
  SelectTripType,
  StepContainer,
  LastStep,
  CreateStartActions,
} from "./components";
import { Step, type StepValue, LAST_STEP } from "./constants";

const TOTAL_STEPS = 4;

const STEP_ICONS = [
  <MapPin size={18} />,
  <Calendar size={18} />,
  <Users size={18} />,
  <Luggage size={18} />,
];

const STEP_TITLES = {
  [Step.REGION]: "어디로 떠나시나요?",
  [Step.DATE]: "언제 떠나시나요?",
  [Step.COMPANION]: "누구와 함께 떠나시나요?",
  [Step.TRIP_TYPE]: "어떤 여행을 떠나시나요?",
} as const;

export default function PackingCreatePage() {
  const [step, setStep] = useState<StepValue>(Step.REGION);
  const validation = useAtomValue(packingCreateValidationAtom);
  const setPackingState = useSetAtom(packingCreateAtom);
  const { data: templates } = useChecklistTemplate();

  // 저장된 템플릿이 있을 때만 마지막 단계에서 생성 방법(CTA)을 노출
  const hasTemplates = (templates?.length ?? 0) > 0;

  useEffect(() => {
    setPackingState(INITIAL_PACKING_CREATE_STATE);
  }, [setPackingState]);

  const handleStartLoading = useCallback(() => {
    setStep(Step.LOADING);
  }, []);

  const getIsNextBtnDisabled = useCallback(() => {
    switch (step) {
      case Step.REGION:
        return !validation.hasRegion;
      case Step.DATE:
        return !validation.hasDates;
      case Step.COMPANION:
        return !validation.hasCompanion;
      case Step.TRIP_TYPE:
        return false;
      default:
        return false;
    }
  }, [step, validation]);

  const handlePreviousStep = useCallback(() => {
    if (step > Step.REGION) {
      setStep((step - 1) as StepValue);
    }
  }, [step]);

  const handleNextStep = useCallback(() => {
    if (step < LAST_STEP) {
      setStep((step + 1) as StepValue);
    } else if (step === LAST_STEP) {
      setStep(Step.LOADING);
    }
  }, [step]);

  const renderContent = useCallback(() => {
    if (step === Step.REGION) {
      return (
        <StepContainer title={STEP_TITLES[Step.REGION]}>
          <SearchRegionComboBox placeholder="예: 제주, Tokyo, 다낭" />
        </StepContainer>
      );
    }

    if (step === Step.DATE) {
      return (
        <StepContainer title={STEP_TITLES[Step.DATE]}>
          <SearchCalendar />
        </StepContainer>
      );
    }

    if (step === Step.COMPANION) {
      return (
        <StepContainer title={STEP_TITLES[Step.COMPANION]}>
          <TravelCompanion />
        </StepContainer>
      );
    }

    if (step === Step.TRIP_TYPE) {
      return (
        <StepContainer title={STEP_TITLES[Step.TRIP_TYPE]}>
          <SelectTripType />
        </StepContainer>
      );
    }

    return null;
  }, [step]);

  return (
    <PageLayout>
      <Container maxW="100%" pt={6} px={1}>
        <StepIndicator
          count={TOTAL_STEPS}
          currentStep={step === Step.LOADING ? TOTAL_STEPS : step}
          icons={STEP_ICONS}
          completedContent={step === Step.LOADING ? <LastStep /> : undefined}
          renderContent={renderContent}
        />

        {step !== Step.LOADING &&
          (step === LAST_STEP && hasTemplates ? (
            <CreateStartActions
              templates={(templates ?? []) as ChecklistTemplateWithCategories[]}
              onStart={handleStartLoading}
              onPrevious={handlePreviousStep}
            />
          ) : (
            <StepBtnContainer
              currentStep={step}
              totalSteps={TOTAL_STEPS}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              isNextDisabled={getIsNextBtnDisabled()}
            />
          ))}
      </Container>
    </PageLayout>
  );
}
