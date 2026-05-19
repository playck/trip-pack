import { HStack, Box, Text } from "@chakra-ui/react";

interface DayFilterChipsProps {
  availableDays: number[];
  selectedDay: number | null;
  dayColorMap: Map<number, string>;
  onSelectDay: (day: number | null) => void;
}

export default function DayFilterChips({
  availableDays,
  selectedDay,
  dayColorMap,
  onSelectDay,
}: DayFilterChipsProps) {
  if (availableDays.length <= 1) return null;

  return (
    <HStack
      position="absolute"
      top={3}
      left={3}
      right={3}
      zIndex={10}
      gap={1.5}
      overflowX="auto"
      overscrollBehaviorX="contain"
      css={{
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Chip
        label="전체"
        isSelected={selectedDay === null}
        onClick={() => onSelectDay(null)}
      />
      {availableDays.map((day) => {
        const color = dayColorMap.get(day) ?? "#3B82F6";
        const isSelected = selectedDay === day;
        return (
          <Chip
            key={day}
            label={`${day}일차`}
            color={color}
            isSelected={isSelected}
            onClick={() => onSelectDay(isSelected ? null : day)}
          />
        );
      })}
    </HStack>
  );
}

interface ChipProps {
  label: string;
  color?: string;
  isSelected: boolean;
  onClick: () => void;
}

function Chip({ label, color, isSelected, onClick }: ChipProps) {
  const isDayChip = !!color;
  const bgColor = isSelected ? (color ?? "gray.700") : "white";
  const textColor = isSelected ? "white" : "gray.700";

  return (
    <Box
      as="button"
      onClick={onClick}
      px={2.5}
      py={1}
      borderRadius="full"
      bg={bgColor}
      boxShadow="sm"
      transition="all 0.15s ease"
      display="flex"
      alignItems="center"
      gap={1.5}
      flexShrink={0}
      _hover={{ opacity: 0.85 }}
    >
      {isDayChip && !isSelected && (
        <Box w="8px" h="8px" borderRadius="full" bg={color} />
      )}
      <Text
        fontSize="xs"
        fontWeight={isSelected ? "bold" : "medium"}
        color={textColor}
        lineHeight="1"
      >
        {label}
      </Text>
    </Box>
  );
}
