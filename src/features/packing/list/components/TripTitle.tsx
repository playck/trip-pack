import { useState } from "react";
import { Text, HStack, IconButton, Input } from "@chakra-ui/react";
import { toaster } from "@/shared/components/ui/toaster";
import { Edit3, Check, X } from "lucide-react";

import { useUpdateTripTitle } from "@/shared/hooks/useUpdateTripTitle";

interface TripTitleProps {
  tripId: string;
  initialTitle: string;
}

export default function TripTitle({ tripId, initialTitle }: TripTitleProps) {
  const [tripTitle, setTripTitle] = useState(initialTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState("");

  const updateTripTitleMutation = useUpdateTripTitle(tripId, {
    onSuccess: (newTitle: string) => {
      setTripTitle(newTitle);
      setIsEditingTitle(false);
      toaster.create({
        title: "여행명이 수정되었습니다",
        description: `'${newTitle}'로 변경되었습니다`,
        type: "success",
        duration: 2000,
      });
    },
    onError: (error) => {
      toaster.create({
        title: "여행명 수정 실패",
        description: error.message,
        type: "error",
        duration: 2000,
      });
    },
  });

  const handleStartEditTitle = () => {
    setEditTitleValue(tripTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (editTitleValue.trim() && editTitleValue.trim() !== tripTitle) {
      updateTripTitleMutation.mutate(editTitleValue.trim());
    } else {
      setIsEditingTitle(false);
    }
  };

  const handleCancelEditTitle = () => {
    setEditTitleValue("");
    setIsEditingTitle(false);
  };

  if (isEditingTitle) {
    return (
      <HStack gap={1} h="40px" align="center">
        <Input
          value={editTitleValue}
          onChange={(e) => setEditTitleValue(e.target.value)}
          fontSize="xl"
          fontWeight="bold"
          color="gray.800"
          border="1px solid"
          borderColor="blue.300"
          _focus={{ borderColor: "blue.500" }}
          maxLength={20}
          h="28px"
          autoFocus
        />
        <IconButton
          aria-label="여행명 저장"
          size="xs"
          variant="solid"
          bg="green.100"
          color="green.600"
          onClick={handleSaveTitle}
          loading={updateTripTitleMutation.isPending}
        >
          <Check size={16} />
        </IconButton>
        <IconButton
          aria-label="여행명 수정 취소"
          size="xs"
          variant="solid"
          bg="red.100"
          color="red.600"
          onClick={handleCancelEditTitle}
          disabled={updateTripTitleMutation.isPending}
        >
          <X size={16} />
        </IconButton>
      </HStack>
    );
  }

  return (
    <HStack justify="space-between" align="center" h="40px">
      <Text
        flex={1}
        fontSize="xl"
        fontWeight="bold"
        color="gray.800"
        lineHeight="28px"
      >
        {tripTitle}
      </Text>
      <IconButton
        aria-label="여행명 수정"
        size="xs"
        variant="solid"
        bg="transparent"
        color="gray.600"
        onClick={handleStartEditTitle}
      >
        <Edit3 size={12} />
      </IconButton>
    </HStack>
  );
}
