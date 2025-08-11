import { Container } from "@chakra-ui/react";
import StepIndicator from "./components/StepIndicator";

export default function PackingCreatePage() {
  return (
    <Container maxW="100%" py={6}>
      <StepIndicator count={3} defaultStep={0} />
    </Container>
  );
}
