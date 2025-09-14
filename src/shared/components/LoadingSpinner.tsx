import { VStack, Text, Spinner, Flex, Container } from "@chakra-ui/react";
import { colorCombinations } from "@/shared/constants/colors";

interface LoadingSpinnerProps {
  message?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  py?: number;
  gap?: number;
  centered?: boolean;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "불러오는 중...",
  size = "lg",
  color = colorCombinations.defaultCard.text,
  py = 8,
  gap = 4,
  centered = false,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <VStack gap={gap} py={py}>
      <Spinner size={size} color={color} />
      <Text color={color} opacity={0.7}>
        {message}
      </Text>
    </VStack>
  );

  if (centered) {
    const centerContainer = (
      <Flex
        justify="center"
        align="center"
        minH={fullScreen ? "calc(100vh - 120px)" : "50vh"}
        w="full"
      >
        {content}
      </Flex>
    );

    if (fullScreen) {
      return (
        <Container maxW="6xl" py={5} px={0}>
          {centerContainer}
        </Container>
      );
    }

    return centerContainer;
  }

  return content;
}
