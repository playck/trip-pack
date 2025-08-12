import { Container } from "@chakra-ui/react";
import StepIndicator from "./components/StepIndicator";
import SearchRegionComboBox from "./components/SearchRegionComboBox";

export default function PackingCreatePage() {
  return (
    <Container maxW="100%" py={6}>
      <StepIndicator
        count={3}
        defaultStep={0}
        renderContent={(index) =>
          index === 0 ? (
            <SearchRegionComboBox
              label="여행 지역 검색"
              placeholder="예: 제주, Tokyo, 다낭"
              onChange={(region) => console.log("selected region:", region)}
            />
          ) : null
        }
      />
    </Container>
  );
}
