import { Badge, HStack } from "@chakra-ui/react";

interface SuggestionChipsProps {
  items: string[];
  onSelect: (value: string) => void;
}

export default function SuggestionChips({
  items,
  onSelect,
}: SuggestionChipsProps) {
  if (items.length === 0) return null;

  return (
    <HStack
      gap={2}
      w="full"
      overflowX="auto"
      css={{
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {items.map((item) => (
        <Badge
          key={item}
          as="button"
          variant="outline"
          size="lg"
          fontSize="xs"
          borderRadius="full"
          flexShrink={0}
          cursor="pointer"
          onClick={() => onSelect(item)}
        >
          {item}
        </Badge>
      ))}
    </HStack>
  );
}
