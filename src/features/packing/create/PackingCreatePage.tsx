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

  const getIsNextDisabled = () => {
    switch (step) {
      case 0:
        return !validation.hasRegion;
      case 1:
        return !validation.hasDates;
      default:
        return false;
    }
  };

  return (
    <Container maxW="100%" py={6}>
      <StepIndicator
        count={3}
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
                </Box>
              </VStack>
            );
          }

          return null;
        }}
      />
      <StepBtnContainer
        currentStep={step}
        totalSteps={3}
        onPrevious={() => {
          if (step > 0) {
            setStep(step - 1);
          }
        }}
        onNext={() => {
          if (step < 2) {
            setStep(step + 1);
          }
        }}
        isNextDisabled={getIsNextDisabled()}
      />
    </Container>
  );
}
