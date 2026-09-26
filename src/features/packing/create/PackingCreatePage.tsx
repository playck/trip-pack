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

/** LOADING 은 stepSequence 에 들어가지 않아 여기 없다. */
const STEPS: Partial<
  Record<
    StepValue,
    { icon: React.ReactNode; title: string; body: React.ReactNode }
  >
> = {
  [Step.REGION]: {
    icon: <MapPin size={18} />,
    title: "어디로 떠나시나요?",
    body: <SearchRegionComboBox placeholder="예: 제주, Tokyo, 다낭" />,
  },
  [Step.DATE]: {
    icon: <Calendar size={18} />,
    title: "언제 떠나시나요?",
    body: <SearchCalendar />,
  },
  [Step.COMPANION]: {
    icon: <Users size={18} />,
    title: "누구와 함께 떠나시나요?",
    body: <TravelCompanion />,
  },
  [Step.TRIP_TYPE]: {
    icon: <Luggage size={18} />,
    title: "어떤 여행을 떠나시나요?",
    body: <SelectTripType />,
  },
  [Step.STYLE]: {
    icon: <SlidersHorizontal size={18} />,
    title: "짐 많이 챙기는 편이세요?",
    body: <SelectPackingStyle />,
  },
};

export default function PackingCreatePage() {
  const [step, setStep] = useState<StepValue>(Step.REGION);
  const validation = useAtomValue(packingCreateValidationAtom);
  const packingState = useAtomValue(packingCreateAtom);
  const setPackingState = useSetAtom(packingCreateAtom);
  const { data: templates } = useChecklistTemplate();

  const { user } = useAuth();
  const { packingStyle } = usePackingStyle(user?.id);
  const savePackingStyle = useUpdatePackingStyle(user?.id);

  // 저장된 템플릿이 있을 때만 여행유형 단계에서 생성 방법(CTA)을 노출
  const hasTemplates = (templates?.length ?? 0) > 0;

  useEffect(() => {
    setPackingState(INITIAL_PACKING_CREATE_STATE);
  }, [setPackingState]);

  // LastStep 이 profiles 를 조회하지 않도록 atom 에 시드해 둔다
  useEffect(() => {
    if (!packingStyle) return;
    setPackingState((prev) =>
      prev.packingStyle === packingStyle ? prev : { ...prev, packingStyle },
    );
  }, [packingStyle, setPackingState]);

  // 마운트 시 한 번만 정한다 — 도중에 바뀌면 표시 단계 수가 깜빡인다
  const [needsStyleStep] = useState(() => packingStyle === null);

  // 단계 수가 4/5로 달라져 `step + 1` 인덱스 산술이 성립하지 않는다
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
    const current = STEPS[step];
    if (!current) return null;
    return <StepContainer title={current.title}>{current.body}</StepContainer>;
  }, [step]);

  return (
    <PageLayout>
      <Container maxW="100%" pt={6} px={1}>
        <StepIndicator
          count={totalSteps}
          currentStep={step === Step.LOADING ? totalSteps : currentIndex}
          icons={stepSequence.map((value) => STEPS[value]?.icon)}
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
