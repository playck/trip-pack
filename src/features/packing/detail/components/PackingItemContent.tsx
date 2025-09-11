import { Box, Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";

import {
  Checkbox,
  CabinPolicyIcon,
  CabinPolicyModal,
} from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import type { CabinPolicy } from "@/shared/components/CabinPolicyIcon";

interface PackingItemContentProps {
  itemName: string;
  isChecked: boolean;
  cabinPolicy?: CabinPolicy | null;
  cabinNotes?: string | null;
  onToggleCheck: () => void;
  onOpenActions: () => void;
}

export default function PackingItemContent({
  itemName,
  isChecked,
  cabinPolicy,
  cabinNotes,
  onToggleCheck,
  onOpenActions,
}: PackingItemContentProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack justify="space-between" align="center">
        <Flex alignItems="center" flex={1}>
          <Flex gap={1} alignItems="center">
            <Checkbox
              isChecked={isChecked}
              onChange={onToggleCheck}
              size="md"
              colorScheme={colors.primary.palette}
            />
            <Text
              fontSize="md"
              fontWeight="medium"
              cursor="pointer"
              onClick={onToggleCheck}
            >
              {itemName}
            </Text>
          </Flex>
          <CabinPolicyIcon policy={cabinPolicy} onClick={onOpen} />
        </Flex>

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
          cursor="pointer"
          _active={{
            bg: "gray.200",
          }}
          onClick={onOpenActions}
        >
          <MoreVertical size={16} />
        </Box>
      </HStack>

      <CabinPolicyModal
        isOpen={isOpen}
        onClose={onClose}
        itemName={itemName}
        policy={cabinPolicy}
        cabinNotes={cabinNotes}
      />
    </>
  );
}
