import { Box } from "@chakra-ui/react";
import type { CategoryWithItems } from "@/features/packing/type";
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
      <Box px={4} py={4}>
        <CheckList categories={categories} />
      </Box>
    </BottomSheet>
  );
}
