import { Box, Flex } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

interface DateItem {
  date: string;
  label: string;
  dayNumber: number;
}

interface DateTabListProps {
  dateList: DateItem[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateTabList({
  dateList,
  selectedDate,
  onSelectDate,
}: DateTabListProps) {
  return (
    <Box
      overflowX="auto"
      overflowY="hidden"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Flex gap={0} minW="max-content" px={0}>
        {dateList.map((dateItem) => (
          <Box
            key={dateItem.date}
            py={3}
            px={4}
            borderBottom="2px solid"
            borderColor={
              selectedDate === dateItem.date
                ? colors.primary.palette
                : "transparent"
            }
            color={
              selectedDate === dateItem.date
                ? colors.primary.palette
                : "gray.600"
            }
            fontWeight={selectedDate === dateItem.date ? "bold" : "normal"}
            fontSize="sm"
            whiteSpace="nowrap"
            cursor="pointer"
            onClick={() => onSelectDate(dateItem.date)}
          >
            {dateItem.label}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
