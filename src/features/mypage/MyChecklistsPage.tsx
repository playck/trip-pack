import { useState } from "react";
import { VStack, Text, Center, Spinner } from "@chakra-ui/react";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import PageLayout from "@/shared/components/layout/PageLayout";
import {
  useChecklistTemplates,
  useDeleteChecklistTemplate,
} from "@/features/packing/template/services";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { colors } from "@/shared/constants/colors";
import { ChecklistCard } from "./components/my-checklists";

export default function MyChecklistsPage() {
  const navigate = useNavigate();
  const { data: templates, isLoading } = useChecklistTemplates();
  const { mutate: deleteTemplate } = useDeleteChecklistTemplate();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    navigate({
      to: "/mypage/my-checklists/$templateId",
      params: { templateId: id },
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTemplate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <PageLayout>
      <VStack align="stretch" gap={3} py={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.800">
          나의 체크리스트 목록
        </Text>

        {isLoading ? (
          <Center h="30vh">
            <Spinner color={colors.primary.palette} />
          </Center>
        ) : !templates || templates.length === 0 ? (
          <Center h="30vh">
            <VStack gap={2}>
              <ClipboardList size={48} color={colors.neutral.fg} />
              <Text color="gray.500">저장된 체크리스트가 없습니다.</Text>
              <Text fontSize="sm" color="gray.400">
                여행 준비물을 저장하면 여기에 표시됩니다.
              </Text>
            </VStack>
          </Center>
        ) : (
          <VStack gap={3} align="stretch">
            {templates.map((template) => (
              <ChecklistCard
                key={template.id}
                template={template}
                onClick={handleCardClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </VStack>
        )}
      </VStack>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={handleCancelDelete}
        title="체크리스트 삭제"
        message="이 체크리스트를 삭제하시겠습니까? 삭제된 체크리스트는 복구할 수 없습니다."
        confirmLabel="삭제"
        isDangerous
        onConfirm={handleConfirmDelete}
      />
    </PageLayout>
  );
}
