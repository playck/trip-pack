import {
  Box,
  VStack,
  Text,
  HStack,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useSetAtom, useAtomValue } from "jotai";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";

import { Checkbox, BottomSheet } from "@/shared/components";
import type { PackItem } from "@/shared/data/checkList";

import {
  toggleItemAtom,
  checkedItemsAtom,
} from "../../list/store/checklistAtom";

interface PackingItemProps {
  item: PackItem;
  categoryName: string;
}

export default function PackingItem({ item, categoryName }: PackingItemProps) {
  const checkedItems = useAtomValue(checkedItemsAtom);
  const toggleItem = useSetAtom(toggleItemAtom);
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const handleItemCheck = () => {
    toggleItem({
      categoryName,
      itemName: item.name,
    });
  };

  const isItemChecked = () => {
    const key = `${categoryName}-${item.name}`;
    return !!checkedItems[key];
  };

  const handleEdit = () => {
    onClose();
  };

  const handleDelete = () => {
    onClose();
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      shadow="xs"
    >
      <VStack gap={1} align="stretch">
        <HStack justify="space-between" align="center">
          <Checkbox
            isChecked={isItemChecked()}
            onChange={handleItemCheck}
            label={item.name}
            size="md"
            colorScheme="blue"
          />

          <Box
            as="button"
            aria-label="옵션 더보기"
            w="8"
            h="8"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            borderRadius="md"
            _hover={{
              color: "gray.600",
              bg: "gray.100",
            }}
            _active={{
              bg: "gray.200",
            }}
            onClick={onOpen}
            cursor="pointer"
          >
            <MoreVertical size={16} />
          </Box>
        </HStack>

        {item.notes && (
          <Text fontSize="xs" color="gray.600" lineHeight="1.4" pl="8">
            {item.notes}
          </Text>
        )}
      </VStack>

      <BottomSheet isOpen={isOpen} onClose={onClose} title={item.name}>
        <VStack gap={0} w="full">
          {/* 액션 버튼들 */}
          <Button
            variant="ghost"
            size="lg"
            w="full"
            h="14"
            justifyContent="flex-start"
            color="gray.800"
            fontWeight="medium"
            _hover={{ bg: "gray.50" }}
            _active={{ bg: "gray.100" }}
            onClick={handleEdit}
          >
            <HStack gap={3} w="full" p={0}>
              <Edit3 size={18} />
              <Text>수정하기</Text>
            </HStack>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            w="full"
            h="14"
            justifyContent="flex-start"
            color="red.500"
            fontWeight="medium"
            _hover={{ bg: "red.50" }}
            _active={{ bg: "red.100" }}
            onClick={handleDelete}
          >
            <HStack gap={3} w="full">
              <Trash2 size={18} />
              <Text>삭제하기</Text>
            </HStack>
          </Button>
        </VStack>
      </BottomSheet>
    </Box>
  );
}
