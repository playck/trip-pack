import { useState } from "react";
import { Container } from "@chakra-ui/react";
import { useAtomValue } from "jotai";

import {
  packingCreateAtom,
  packingCreateValidationAtom,
} from "./store/packingCreateAtom";
import StepIndicator from "./components/StepIndicator";
import SearchRegionComboBox from "./components/SearchRegionComboBox";
import StepBtnContainer from "./components/StepBtnContainer";
import SearchCalendar from "./components/SearchCalendar";
import TravelCompanion from "./components/SelectTravleCompanion";
import SelectTripType from "./components/SelectTripType";
import StepContainer from "./components/StepContainer";
import { Step, type StepValue, LAST_STEP } from "./constants";

const TOTAL_STEPS = 4;

const STEP_TITLES = {
  [Step.REGION]: "어디로 떠나시나요?",
  [Step.DATE]: "언제 떠나시나요?",
  [Step.COMPANION]: "누구와 함께 떠나시나요?",
  [Step.TRIP_TYPE]: "어떤 여행을 떠나시나요?",
} as const;

export default function PackingCreatePage() {
  const [step, setStep] = useState<StepValue>(Step.REGION);
  const packingCreateState = useAtomValue(packingCreateAtom);
  const validation = useAtomValue(packingCreateValidationAtom);

  const getIsNextDisabled = () => {
    switch (step) {
      case Step.REGION:
        return !validation.hasRegion;
      case Step.DATE:
        return !validation.hasDates;
      case Step.COMPANION:
        return !validation.hasCompanion;
      case Step.TRIP_TYPE:
        return !validation.hasTripTypes;
      default:
        return false;
    }
  };

  return (
    <Container maxW="100%" py={1} px={1}>
      <StepIndicator
        count={TOTAL_STEPS}
        currentStep={step}
        renderContent={() => {
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
        }}
      />

      <StepBtnContainer
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        onPrevious={() => {
          if (step > Step.REGION) {
            setStep((step - 1) as StepValue);
          }
        }}
        onNext={() => {
          if (step < LAST_STEP) {
            setStep((step + 1) as StepValue);
          } else {
            console.log("패킹 리스트 생성:", packingCreateState);
          }
        }}
        isNextDisabled={getIsNextDisabled()}
      />
    </Container>
  );
}
