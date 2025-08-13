import { useState } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import type { Region } from "@/shared/data/regions";

import { packingCreateAtom } from "./store/packingCreateAtom";
import StepIndicator from "./components/StepIndicator";
import SearchRegionComboBox from "./components/SearchRegionComboBox";
import StepBtnContainer from "./components/StepBtnContainer";

export default function PackingCreatePage() {
  const [step, setStep] = useState(0);
  const [packingCreateState, setPackingCreateState] =
    useAtom(packingCreateAtom);

  const handleRegionChange = (region: Region | null) => {
    setPackingCreateState((prev) => ({
      ...prev,
      region,
    }));
  };

  const isNextDisabled = step === 0 && !packingCreateState.region;

  return (
    <Container maxW="100%" py={6}>
      <StepIndicator
        count={3}
        currentStep={step}
        renderContent={() =>
          step === 0 ? (
            <SearchRegionComboBox
              label="여행 지역 검색"
              placeholder="예: 제주, Tokyo, 다낭"
              onChange={handleRegionChange}
            />
          ) : (
            <Box>
              <Text>여행 지역: {packingCreateState.region?.name}</Text>
            </Box>
          )
        }
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
        isNextDisabled={isNextDisabled}
      />
    </Container>
  );
}
