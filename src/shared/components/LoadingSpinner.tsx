import { VStack, Text, Flex, Container, Box } from "@chakra-ui/react";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lotties/loading.json";
import { colorCombinations } from "@/shared/constants/colors";

interface LoadingSpinnerProps {
  message?: string;
  color?: string;
  py?: number;
  gap?: number;
  centered?: boolean;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message = "",
  color = colorCombinations.defaultCard.text,
  py = 8,
  gap = 4,
  centered = false,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const size = 200;

  const content = (
    <VStack gap={gap} py={py}>
      <Box w={`${size}px`} h={`${size}px`}>
        <Lottie animationData={loadingAnimation} loop={true} />
      </Box>
      {message && (
        <Text color={color} opacity={0.7} mt={-2}>
          {message}
        </Text>
      )}
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
