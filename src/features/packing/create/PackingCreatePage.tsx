import { useState } from "react";
import { Container, Box, Text, VStack } from "@chakra-ui/react";
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
import { type CompanionType, type CompanionTypeOption } from "./data/data";

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

  const getIsNextDisabled = () => {
    switch (step) {
      case 0:
        return !validation.hasRegion;
      case 1:
        return !validation.hasDates;
      case 2:
        return !validation.hasCompanion;
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
              <VStack gap={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">
                  선택한 정보 확인
                </Text>
                <Box>
                  <Text fontWeight="medium">
                    여행 지역: {packingCreateState.region?.name}
                  </Text>
                  <Text fontWeight="medium">
                    여행 날짜:{" "}
                    {packingCreateState.dates.startDate?.toLocaleDateString()} ~{" "}
                    {packingCreateState.dates.endDate?.toLocaleDateString()}
                  </Text>
                  <Text fontWeight="medium">
                    동행:{" "}
                    {packingCreateState.companion === "alone"
                      ? "혼자 가요"
                      : `일행이 있어요${
                          packingCreateState.companionTypes.length > 0
                            ? ` (${packingCreateState.companionTypes.join(", ")})`
                            : ""
                        }`}
                  </Text>
                </Box>
              </VStack>
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
          if (step < 3) {
            setStep(step + 1);
          }
        }}
        isNextDisabled={getIsNextDisabled()}
      />
    </Container>
  );
}
