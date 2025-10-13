import { VStack, HStack, Text, Box, IconButton } from "@chakra-ui/react";
import { Plus, StickyNote } from "lucide-react";
import {
  colors,
  componentColors,
  borderColors,
  textColors,
} from "@/shared/constants/colors";

interface DayScheduleCardProps {
  dayNumber: number;
  date: string;
  formattedDate: string;
  onAddSchedule?: () => void;
  onAddMemo?: () => void;
}

export default function DayScheduleCard({
  dayNumber,
  formattedDate,
  onAddSchedule,
  onAddMemo,
}: DayScheduleCardProps) {
  return (
    <Box
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColors.default}
      bg={componentColors.card.background}
      overflow="hidden"
    >
      {/* 헤더 */}
      <HStack
        px={3}
        py={2}
        bg={colors.primary.subtle}
        borderBottomWidth="1px"
        borderColor={borderColors.default}
        justify="space-between"
        align="center"
      >
        <HStack gap={2}>
          <Text fontSize="lg" fontWeight="bold" color={colors.primary.fg}>
            {dayNumber}일차
          </Text>
          <Text fontSize="sm" color={textColors.tertiary}>
            {formattedDate}
          </Text>
        </HStack>

        <HStack gap={2}>
          <IconButton
            size="sm"
            variant="solid"
            aria-label="일정 추가"
            onClick={onAddSchedule}
            colorPalette={colors.primary.palette}
          >
            <Plus size={18} />
          </IconButton>
          <IconButton
            size="sm"
            variant="outline"
            aria-label="메모 추가"
            onClick={onAddMemo}
            colorPalette={colors.neutral.palette}
            borderColor={borderColors.emphasized}
          >
            <StickyNote size={18} />
          </IconButton>
        </HStack>
      </HStack>

      {/* 타임라인 영역 */}
      <Box p={3} minH="100px">
        <VStack align="stretch" gap={2}>
          {/* TODO: 타임라인 컴포넌트가 들어갈 자리 */}
          <Box
            p={6}
            borderRadius="md"
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={borderColors.emphasized}
            textAlign="center"
          >
            <Text fontSize="sm" color={textColors.subtle}>
              일정을 추가해주세요
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
