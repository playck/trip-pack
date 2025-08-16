import { useState } from "react";
import { Container, Text, VStack } from "@chakra-ui/react";
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
    <Container maxW="100%" py={6}>
      <StepIndicator
        count={4}
        currentStep={step}
        renderContent={() => {
          if (step === 0) {
            return (
              <SearchRegionComboBox
                label="여행 지역 검색"
                placeholder="예: 제주, Tokyo, 다낭"
                onChange={handleRegionChange}
              />
            );
          }

          if (step === 1) {
            return (
              <VStack gap={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">
                  여행 날짜 선택
                </Text>
                <SearchCalendar />
              </VStack>
            );
          }

          if (step === 2) {
            return (
              <TravelCompanion
                value={packingCreateState.companion || undefined}
                companionTypes={packingCreateState.companionTypes}
                onChange={handleCompanionChange}
                onCompanionTypesChange={handleCompanionTypesChange}
              />
            );
          }

          if (step === 3) {
            return (
              <SelectTripType
                value={packingCreateState.tripTypes}
                onChange={handleTripTypesChange}
              />
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
