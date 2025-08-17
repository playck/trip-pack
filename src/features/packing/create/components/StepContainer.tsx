import type { ReactNode } from "react";
import { VStack, Text } from "@chakra-ui/react";

import PackingInfoBadges from "./PackingInfoBadges";

interface StepContainerProps {
  title: string;
  children: ReactNode;
}

export default function StepContainer({ title, children }: StepContainerProps) {
  return (
    <VStack gap={3} align="stretch" mt="12px">
      <VStack gap={2} align="stretch">
        <Text fontSize="xl" fontWeight="bold">
          {title}
        </Text>
        <PackingInfoBadges />
      </VStack>
      {children}
    </VStack>
  );
}
