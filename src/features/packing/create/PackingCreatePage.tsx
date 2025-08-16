import { useState } from "react";
import { Container } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";

import type { Region } from "@/shared/data/regions";

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
import {
  type CompanionType,
  type CompanionTypeOption,
  type TripTypeOption,
} from "./data/data";

export default function PackingCreatePage() {
  const [step, setStep] = useState(0);
  const [packingCreateState, setPackingCreateState] =
    useAtom(packingCreateAtom);
  const validation = useAtomValue(packingCreateValidationAtom);

  const handleRegionChange = (region: Region | null) => {
    setPackingCreateState((prev) => ({
      ...prev,
      region,
    }));
  };

  const handleCompanionChange = (companion: CompanionType) => {
    setPackingCreateState((prev) => ({
      ...prev,
      companion,
    }));
  };

  const handleCompanionTypesChange = (
    companionTypes: CompanionTypeOption[]
  ) => {
    setPackingCreateState((prev) => ({
      ...prev,
      companionTypes,
    }));
  };

  const handleTripTypesChange = (tripTypes: TripTypeOption[]) => {
    setPackingCreateState((prev) => ({
      ...prev,
      tripTypes,
    }));
  };

  const getIsNextDisabled = () => {
    switch (step) {
      case 0:
        return !validation.hasRegion;
      case 1:
        return !validation.hasDates;
      case 2:
        return !validation.hasCompanion;
      case 3:
        return !validation.hasTripTypes;
      default:
        return false;
    }
  };

  return (
    <Container maxW="100%" py={1} px={1}>
      <StepIndicator
        count={4}
        currentStep={step}
        renderContent={() => {
          if (step === 0) {
            return (
              <StepContainer title="여행 지역을 선택해주세요">
                <SearchRegionComboBox
                  placeholder="예: 제주, Tokyo, 다낭"
                  onChange={handleRegionChange}
                />
              </StepContainer>
            );
          }

          if (step === 1) {
            return (
              <StepContainer title="여행 날짜를 선택해주세요">
                <SearchCalendar />
              </StepContainer>
            );
          }

          if (step === 2) {
            return (
              <StepContainer title="누구와 함께 떠나시나요?">
                <TravelCompanion
                  value={packingCreateState.companion || undefined}
                  companionTypes={packingCreateState.companionTypes}
                  onChange={handleCompanionChange}
                  onCompanionTypesChange={handleCompanionTypesChange}
                />
              </StepContainer>
            );
          }

          if (step === 3) {
            return (
              <StepContainer title="어떤 여행을 떠나시나요?">
                <SelectTripType
                  value={packingCreateState.tripTypes}
                  onChange={handleTripTypesChange}
                />
              </StepContainer>
            );
          }

          return null;
        }}
      />
      <StepBtnContainer
        currentStep={step}
        totalSteps={4}
        onPrevious={() => {
          if (step > 0) {
            setStep(step - 1);
          }
        }}
        onNext={() => {
          if (step < 4) {
            setStep(step + 1);
          } else {
            console.log("패킹 리스트 생성:", packingCreateState);
          }
        }}
        isNextDisabled={getIsNextDisabled()}
      />
    </Container>
  );
}
