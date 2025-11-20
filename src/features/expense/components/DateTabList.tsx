import { Box, Flex } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import { HEADER_HEIGHT } from "@/shared/constants/layout";

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

const ALL_DATE_TAB_VALUE = "all";

export default function DateTabList({
  dateList,
  selectedDate,
  onSelectDate,
}: DateTabListProps) {
  return (
    <Box
      position="sticky"
      top={`${HEADER_HEIGHT}px`}
      zIndex={10}
      overflowX="auto"
      overflowY="hidden"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <Flex gap={0} minW="max-content" px={0}>
        {/* 전체 탭 */}
        <Box
          py={3}
          px={4}
          borderBottom="2px solid"
          borderColor={
            selectedDate === ALL_DATE_TAB_VALUE
              ? colors.primary.palette
              : "transparent"
          }
          color={
            selectedDate === ALL_DATE_TAB_VALUE
              ? colors.primary.palette
              : "gray.600"
          }
          fontWeight={selectedDate === ALL_DATE_TAB_VALUE ? "bold" : "normal"}
          fontSize="sm"
          whiteSpace="nowrap"
          cursor="pointer"
          onClick={() => onSelectDate(ALL_DATE_TAB_VALUE)}
        >
          전체
        </Box>

        {/* 날짜별 탭 */}
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
