import type { ReactNode } from "react";
import { VStack, Text } from "@chakra-ui/react";

interface StepContainerProps {
  title: string;
  children: ReactNode;
}

export default function StepContainer({ title, children }: StepContainerProps) {
  return (
    <VStack gap={3} align="stretch" mt="12px">
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
      {children}
    </VStack>
  );
}
