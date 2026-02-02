import { Box, Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";

import {
  Checkbox,
  CabinPolicyIcon,
  CabinPolicyModal,
} from "@/shared/components";
import { colors } from "@/shared/constants/colors";
import type { CabinPolicy } from "@/shared/data/checkList";
import type { CountryRestriction } from "@/shared/data/baggagePolicyData";

interface PackingItemContentProps {
  itemName: string;
  isChecked: boolean;
  cabinPolicy?: CabinPolicy | null;
  cabinNotes?: string | null;
  checkedPolicy?: CabinPolicy | null;
  checkedNotes?: string | null;
  countryWarning?: CountryRestriction | null;
  isEditMode?: boolean;
  onToggleCheck: () => void;
  onOpenActions: () => void;
}

export default function PackingItemContent({
  itemName,
  isChecked,
  cabinPolicy,
  cabinNotes,
  checkedPolicy,
  checkedNotes,
  countryWarning,
  isEditMode = false,
  onToggleCheck,
  onOpenActions,
}: PackingItemContentProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack justify="space-between" align="center">
        <Flex alignItems="center" flex={1}>
          <Flex
            gap={1}
            alignItems="center"
            flex={1}
            cursor="pointer"
            onClick={isEditMode ? undefined : onToggleCheck}
          >
            <Checkbox
              isChecked={isChecked}
              onChange={isEditMode ? () => {} : onToggleCheck}
              size="md"
              colorScheme={colors.primary.palette}
            />
            <Text fontSize="md" fontWeight="medium">
              {itemName}
            </Text>
          </Flex>
          {!isEditMode && (
            <CabinPolicyIcon policy={cabinPolicy} onClick={onOpen} />
          )}
        </Flex>

        <Box
          as="button"
          aria-label="옵션 더보기"
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.400"
          borderRadius="md"
          cursor={isEditMode ? "default" : "pointer"}
          visibility={isEditMode ? "hidden" : "visible"}
          onClick={isEditMode ? undefined : onOpenActions}
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
        checkedPolicy={checkedPolicy}
        checkedNotes={checkedNotes}
        countryWarning={countryWarning}
      />
    </>
  );
}
