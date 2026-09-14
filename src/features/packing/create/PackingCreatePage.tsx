import { useState, useCallback, useEffect, useMemo } from "react";
import { Container } from "@chakra-ui/react";
import { useAtomValue, useSetAtom } from "jotai";

import {
  MapPin,
  Calendar,
  Users,
  Luggage,
  SlidersHorizontal,
} from "lucide-react";
import PageLayout from "@/shared/components/layout/PageLayout";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  usePackingStyle,
  useUpdatePackingStyle,
} from "@/shared/service/profile";
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
  SelectPackingStyle,
  StepContainer,
  LastStep,
  CreateStartActions,
} from "./components";
import { Step, type StepValue, BASE_STEPS } from "./constants";

const STEP_ICONS: Record<StepValue, React.ReactNode> = {
  [Step.REGION]: <MapPin size={18} />,
  [Step.DATE]: <Calendar size={18} />,
  [Step.COMPANION]: <Users size={18} />,
  [Step.TRIP_TYPE]: <Luggage size={18} />,
  [Step.STYLE]: <SlidersHorizontal size={18} />,
  [Step.LOADING]: null,
};

const STEP_TITLES = {
  [Step.REGION]: "어디로 떠나시나요?",
  [Step.DATE]: "언제 떠나시나요?",
  [Step.COMPANION]: "누구와 함께 떠나시나요?",
  [Step.TRIP_TYPE]: "어떤 여행을 떠나시나요?",
  [Step.STYLE]: "짐 많이 챙기는 편이세요?",
} as const;

export default function PackingCreatePage() {
  const [step, setStep] = useState<StepValue>(Step.REGION);
  const validation = useAtomValue(packingCreateValidationAtom);
  const packingState = useAtomValue(packingCreateAtom);
  const setPackingState = useSetAtom(packingCreateAtom);
  const { data: templates } = useChecklistTemplate();

  const { user } = useAuth();
  const { packingStyle } = usePackingStyle(user?.id);
  const savePackingStyle = useUpdatePackingStyle(user?.id, { silent: true });

  // 저장된 템플릿이 있을 때만 여행유형 단계에서 생성 방법(CTA)을 노출
  const hasTemplates = (templates?.length ?? 0) > 0;

  useEffect(() => {
    setPackingState(INITIAL_PACKING_CREATE_STATE);
  }, [setPackingState]);

  // 이미 저장된 성향은 atom에 시드해 둔다.
  // LastStep 이 profiles를 조회하지 않게 하는 것이 목적이다
  useEffect(() => {
    if (!packingStyle) return;
    setPackingState((prev) =>
      prev.packingStyle === packingStyle ? prev : { ...prev, packingStyle },
    );
  }, [packingStyle, setPackingState]);

  //질문 단계가 필요한지는 마운트 시 한 번만 정한다
  const [needsStyleStep] = useState(() => packingStyle === null);

  // 화면 순서를 배열로 조립한다. 단계 수가 4/5로 달라지므로 `step + 1` 같은 인덱스 산술을 쓰지 않고 이 배열의 위치로만 이동한다
  const stepSequence = useMemo<StepValue[]>(
    () => (needsStyleStep ? [...BASE_STEPS, Step.STYLE] : BASE_STEPS),
    [needsStyleStep],
  );

  const currentIndex = stepSequence.indexOf(step);
  const totalSteps = stepSequence.length;
  const isLastStep = currentIndex === totalSteps - 1;

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
      default:
        return false;
    }
  }, [step, validation]);

  const handlePreviousStep = useCallback(() => {
    if (currentIndex > 0) setStep(stepSequence[currentIndex - 1]);
  }, [currentIndex, stepSequence]);

  const handleNextStep = useCallback(() => {
    if (!isLastStep) {
      setStep(stepSequence[currentIndex + 1]);
      return;
    }

    if (step === Step.STYLE && packingState.packingStyle) {
      savePackingStyle.mutate(packingState.packingStyle);
    }

    handleStartLoading();
  }, [
    isLastStep,
    stepSequence,
    currentIndex,
    step,
    packingState.packingStyle,
    savePackingStyle,
    handleStartLoading,
  ]);

  const renderContent = useCallback(() => {
    switch (step) {
      case Step.REGION:
        return (
          <StepContainer title={STEP_TITLES[Step.REGION]}>
            <SearchRegionComboBox placeholder="예: 제주, Tokyo, 다낭" />
          </StepContainer>
        );
      case Step.DATE:
        return (
          <StepContainer title={STEP_TITLES[Step.DATE]}>
            <SearchCalendar />
          </StepContainer>
        );
      case Step.COMPANION:
        return (
          <StepContainer title={STEP_TITLES[Step.COMPANION]}>
            <TravelCompanion />
          </StepContainer>
        );
      case Step.TRIP_TYPE:
        return (
          <StepContainer title={STEP_TITLES[Step.TRIP_TYPE]}>
            <SelectTripType />
          </StepContainer>
        );
      case Step.STYLE:
        return (
          <StepContainer title={STEP_TITLES[Step.STYLE]}>
            <SelectPackingStyle />
          </StepContainer>
        );
      default:
        return null;
    }
  }, [step]);

  return (
    <PageLayout>
      <Container maxW="100%" pt={6} px={1}>
        <StepIndicator
          count={totalSteps}
          currentStep={step === Step.LOADING ? totalSteps : currentIndex}
          icons={stepSequence.map((value) => STEP_ICONS[value])}
          completedContent={step === Step.LOADING ? <LastStep /> : undefined}
          renderContent={renderContent}
        />

        {step !== Step.LOADING &&
          // CTA 는 여행유형 단계에 고정
          (step === Step.TRIP_TYPE && hasTemplates ? (
            <CreateStartActions
              templates={(templates ?? []) as ChecklistTemplateWithCategories[]}
              onStartAuto={handleNextStep}
              onStartTemplate={handleStartLoading}
              onPrevious={handlePreviousStep}
            />
          ) : (
            <StepBtnContainer
              currentStep={step}
              totalSteps={totalSteps}
              isLastStep={isLastStep}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              isNextDisabled={getIsNextBtnDisabled()}
            />
          ))}
      </Container>
    </PageLayout>
  );
}
