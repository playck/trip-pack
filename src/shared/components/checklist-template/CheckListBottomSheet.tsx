import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import type { CategoryWithItems } from "@/features/packing/type";
import { backgrounds, borderColors, colors } from "@/shared/constants/colors";
import CheckList from "./CheckList";
import BottomSheet from "../BottomSheet";

interface CheckListBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  categories: CategoryWithItems[];
}

export default function CheckListBottomSheet({
  isOpen,
  onClose,
  title = "체크리스트 미리보기",
  categories,
}: CheckListBottomSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <Flex flexDirection="column" h="100%" minHeight="65vh">
        <Box px={4} py={4} flex={1} overflowY="auto">
          <CheckList categories={categories} />
        </Box>
        <Box
          w="full"
          position="sticky"
          bottom={0}
          left={0}
          right={0}
          p={4}
          mt={2}
          bg={backgrounds.primary}
          borderTop="1px"
          borderColor={borderColors.default}
        >
          <HStack gap={3}>
            <Button
              flex={1}
              variant="outline"
              size="lg"
              borderRadius="xl"
              // onClick={onCancel}
            >
              취소
            </Button>
            <Button
              flex={1}
              colorPalette={colors.primary.palette}
              variant="solid"
              size="lg"
              borderRadius="xl"
              // onClick={handlAddCategory}
            >
              저장
            </Button>
          </HStack>
        </Box>
      </Flex>
    </BottomSheet>
  );
}
