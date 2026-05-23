import { HStack, VStack, Box, Text } from "@chakra-ui/react";
import { MoreHorizontal } from "lucide-react";
import { colors } from "@/shared/constants/colors";
import {
  EXPENSE_CATEGORIES,
  findCategoryByLabel,
  type ExpenseCategoryDef,
} from "../constants/categories";

interface ExpenseCategoryChipsProps {
  selectedLabel: string | null;
  onSelect: (category: ExpenseCategoryDef) => void;
  legacyLabel?: string | null;
}

export default function ExpenseCategoryChips({
  selectedLabel,
  onSelect,
  legacyLabel,
}: ExpenseCategoryChipsProps) {
  const showLegacy = !!legacyLabel && !findCategoryByLabel(legacyLabel);

  const legacyDef: ExpenseCategoryDef | null = showLegacy
    ? {
        id: "legacy",
        label: legacyLabel!,
        icon: MoreHorizontal,
        color: "gray",
      }
    : null;

  const items = legacyDef ? [legacyDef, ...EXPENSE_CATEGORIES] : EXPENSE_CATEGORIES;

  return (
    <HStack
      gap={3}
      overflowX="auto"
      w="full"
      pb={1}
      css={{
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {items.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedLabel === cat.label;
        return (
          <VStack
            key={`${cat.id}-${cat.label}`}
            as="button"
            gap={1}
            minW="56px"
            flexShrink={0}
            onClick={() => onSelect(cat)}
          >
            <Box
              w="48px"
              h="48px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={
                isSelected
                  ? `${colors.primary.palette}.500`
                  : `${cat.color}.50`
              }
              color={isSelected ? "white" : `${cat.color}.500`}
              border={isSelected ? "none" : "1px solid"}
              borderColor={`${cat.color}.100`}
              transition="all 0.15s"
            >
              <Icon size={22} />
            </Box>
            <Text
              fontSize="xs"
              fontWeight={isSelected ? "semibold" : "medium"}
              color={
                isSelected ? `${colors.primary.palette}.600` : "gray.700"
              }
              maxW="64px"
              lineClamp={1}
            >
              {cat.label}
            </Text>
          </VStack>
        );
      })}
    </HStack>
  );
}
