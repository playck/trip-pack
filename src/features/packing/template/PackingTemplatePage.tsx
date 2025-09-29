import { Container, Text, VStack } from "@chakra-ui/react";

import PageLayout from "@/shared/components/layout/PageLayout";
import { colorCombinations } from "@/shared/constants/colors";
import { TemplateCard } from "./components";

// 템플릿 데이터 타입
interface PackingTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  items: string[];
  tags: string[];
}

const filteredTemplates: PackingTemplate[] = [
  {
    id: "1",
    title: "해외 여행 기본템",
    description: "해외 여행시 꼭 필요한 필수 아이템들",
    category: "해외여행",
    items: ["여권", "비행기표", "숙박 예약증", "여행자보험", "환전"],
    tags: ["필수", "해외", "기본"],
  },
];

export default function PackingTemplatePage() {
  return (
    <PageLayout>
      <Container maxW="container.md" py={4}>
        <VStack gap={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            📋 체크리스트 템플릿
          </Text>

          <VStack gap={4}>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={(template) => {
                  // 템플릿 클릭 핸들러 (나중에 구현)
                  console.log("Template clicked:", template);
                }}
              />
            ))}
          </VStack>

          {filteredTemplates.length === 0 && (
            <VStack gap={4} py={8}>
              <Text
                color={colorCombinations.defaultCard.textMuted}
                textAlign="center"
              >
                해당 카테고리에 템플릿이 없습니다.
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </PageLayout>
  );
}
