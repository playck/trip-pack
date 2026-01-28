import { Box, VStack, Text, useDisclosure } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import type { CategoryWithItems } from "@/features/packing/type";
import { ConfirmDialog } from "@/shared/components";
import { statusColors } from "@/shared/constants/colors";

interface TemplateCategoryBoxProps {
  category: CategoryWithItems;
  icon: LucideIcon;
  isEditMode?: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export default function TemplateCategoryBox({
  category,
  icon: Icon,
  isEditMode = false,
  onClick,
  onDelete,
}: TemplateCategoryBoxProps) {
  const itemCount = category.items.length;
  const { open: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    onDelete();
    onDeleteClose();
  };

  return (
    <>
      <Box
        p={3}
        bg="gray.100"
        borderRadius="xl"
        border="1px"
        borderColor="gray.200"
        position="relative"
        cursor="pointer"
        onClick={onClick}
      >
        {/* 삭제 버튼 - 편집 모드일 때만 표시 */}
        {isEditMode && (
          <Box
            as="button"
            position="absolute"
            top={1}
            right={1}
            p={1}
            borderRadius="full"
            bg={statusColors.error.bg}
            color={statusColors.error.text}
            onClick={handleDeleteClick}
          >
            <X size={14} />
          </Box>
        )}

        <VStack gap={3} w="full">
          <Box
            w="12"
            h="12"
            bg="white"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="teal.500"
          >
            <Icon size={28} />
          </Box>
          <VStack gap={1} w="full">
            <Text
              fontSize="sm"
              fontWeight="medium"
              textAlign="center"
              color="gray.700"
            >
              {category.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {itemCount}개 아이템
            </Text>
          </VStack>
        </VStack>
      </Box>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title="카테고리 삭제"
        confirmLabel="삭제"
        onConfirm={handleDeleteConfirm}
        isDangerous={true}
      >
        <Text>
          <Text as="span" fontWeight="bold">
            "{category.name}"
          </Text>{" "}
          카테고리를 삭제하시겠습니까?
          <br />
          <Text as="span" color="red.500" fontWeight="medium">
            포함된 {itemCount}개의 아이템도 함께 삭제됩니다.
          </Text>
        </Text>
      </ConfirmDialog>
    </>
  );
}
