import { Box, Text, VStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

interface PackingTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  items: string[];
}

interface TemplateCardProps {
  template: PackingTemplate;
  onClick?: (template: PackingTemplate) => void;
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Box
      w="full"
      bg={colors.primary.subtle}
      borderRadius="lg"
      p={4}
      cursor="pointer"
      borderWidth="2px"
      borderColor={colors.primary.muted}
      onClick={() => onClick?.(template)}
    >
      <VStack align="start" gap={3}>
        <Text fontWeight="bold" fontSize="lg" color="gray.800" lineHeight="1.2">
          {template.title}
        </Text>
        <Text color="gray.600" fontSize="sm" lineClamp={2} lineHeight="1.5">
          {template.description}
        </Text>
      </VStack>
    </Box>
  );
}
