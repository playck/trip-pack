import { VStack, Input, Text, Box, Textarea, HStack } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";
import type { TripMemberWithProfile } from "@/features/trip-members/services/api";

interface TodoItemFormProps {
  name: string;
  notes: string;
  dueDate: string;
  selectedAssigneeIds: string[];
  members: TripMemberWithProfile[];
  onNameChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onAssigneeToggle: (memberId: string) => void;
}

export default function TodoItemForm({
  name,
  notes,
  dueDate,
  selectedAssigneeIds,
  members,
  onNameChange,
  onNotesChange,
  onDueDateChange,
  onAssigneeToggle,
}: TodoItemFormProps) {
  return (
    <VStack gap={0} w="full" h="full" maxH="80vh">
      <Box flex={1} overflowY="auto" w="full" px={4}>
        <VStack gap={5} w="full">
          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              할일명
            </Text>
            <Input
              placeholder="할일을 입력하세요"
              value={name}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onNameChange(e.target.value)}
            />
          </VStack>

          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              마감일 (선택)
            </Text>
            <Input
              type="date"
              value={dueDate}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onDueDateChange(e.target.value)}
            />
          </VStack>

          {members.length > 0 && (
            <VStack gap={3} w="full">
              <Text fontSize="md" fontWeight="medium" alignSelf="start">
                담당자 (선택)
              </Text>
              <HStack gap={2} flexWrap="wrap" w="full">
                {members.map((member) => {
                  const isSelected = selectedAssigneeIds.includes(member.id);
                  return (
                    <Box
                      key={member.id}
                      as="button"
                      px={3}
                      py={1.5}
                      bg={
                        isSelected
                          ? `${colors.primary.palette}.500`
                          : "gray.100"
                      }
                      color={isSelected ? "white" : "gray.600"}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      transition="all 0.2s"
                      onClick={() => onAssigneeToggle(member.id)}
                    >
                      {member.profiles?.username ||
                        member.profiles?.email ||
                        "알 수 없음"}
                    </Box>
                  );
                })}
              </HStack>
            </VStack>
          )}

          <VStack gap={2} w="full">
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
              메모 (선택)
            </Text>
            <Textarea
              rows={3}
              placeholder="추가 메모를 입력하세요"
              value={notes}
              size="lg"
              borderRadius="xl"
              onChange={(e) => onNotesChange(e.target.value)}
            />
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
}
