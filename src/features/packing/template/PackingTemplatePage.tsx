import { Container, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";

import PageLayout from "@/shared/components/layout/PageLayout";
import { colorCombinations } from "@/shared/constants/colors";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { TemplateCard } from "./components";
import { useChecklistTemplate } from "./hooks";

interface PackingTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  items: string[];
}

export default function PackingTemplatePage() {
  const navigate = useNavigate();
  const { data: templates = [], isLoading, error } = useChecklistTemplate();

  if (isLoading) {
    return (
      <PageLayout>
        <Container maxW="container.md" py={4}>
          <LoadingSpinner />
        </Container>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Container maxW="container.md" py={4}>
          <VStack gap={4} py={8}>
            <Text color="red.500" textAlign="center">
              템플릿을 불러오는 중 오류가 발생했습니다: {error?.message}
            </Text>
          </VStack>
        </Container>
      </PageLayout>
    );
  }

  const convertedTemplates: PackingTemplate[] = templates.map((template) => ({
    id: template.id,
    title: template.title,
    description: template.description || "",
    category: "템플릿",
    items: (template.template_categories ?? []).map((c) => c.name),
  }));

  return (
    <PageLayout>
      <Container maxW="container.md" py={4}>
        <VStack gap={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            📋 체크리스트 템플릿
          </Text>

          <VStack gap={4}>
            {convertedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={(t) => {
                  navigate({
                    to: "/mypage/my-checklists/$templateId",
                    params: { templateId: t.id },
                  });
                }}
              />
            ))}
          </VStack>

          {convertedTemplates.length === 0 && (
            <VStack gap={4} py={8}>
              <Text
                color={colorCombinations.defaultCard.textMuted}
                textAlign="center"
              >
                등록된 템플릿이 없습니다.
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </PageLayout>
  );
}
