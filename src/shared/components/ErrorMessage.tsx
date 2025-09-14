import { Box, Text, VStack, Flex, Container } from "@chakra-ui/react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  title?: string;
  centered?: boolean;
  variant?: "default" | "minimal";
  fullScreen?: boolean;
}

export default function ErrorMessage({
  message,
  title,
  centered = false,
  variant = "default",
  fullScreen = false,
}: ErrorMessageProps) {
  const content = (
    <VStack gap={4} align="center" textAlign="center" w="full">
      {/* 비상 아이콘 */}
      <Box
        p={4}
        borderRadius="full"
        bg="red.50"
        border="2px solid"
        borderColor="red.200"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <AlertTriangle size={32} color="#DC2626" />
      </Box>

      {/* 에러 메시지 */}
      <VStack gap={2} align="center" w="full" maxW="md">
        {variant === "default" && title && (
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="gray.800"
            lineHeight="1.4"
            textAlign="center"
            w="full"
          >
            {title}
          </Text>
        )}
        <Text
          fontSize={variant === "minimal" ? "sm" : "md"}
          color="gray.600"
          lineHeight="1.5"
          textAlign="center"
          w="full"
        >
          {message}
        </Text>
      </VStack>
    </VStack>
  );

  if (centered) {
    const centerContainer = (
      <Flex
        justify="center"
        align="center"
        minH={fullScreen ? "calc(100vh - 120px)" : "50vh"}
        w="full"
        px={4}
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

  if (variant === "minimal") {
    return (
      <Box
        p={4}
        bg="red.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="red.200"
      >
        <Text color="red.600" fontSize="sm">
          {message}
        </Text>
      </Box>
    );
  }

  return content;
}
