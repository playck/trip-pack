import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { VStack, Text, HStack, Box, Badge } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { BottomSheet, ConfirmDialog } from "@/shared/components";
import { useAuth } from "@/shared/hooks/useAuth";
import { colors } from "@/shared/constants/colors";
import { useTripMembers, useRemoveMember } from "../hooks/useTripMembers";
import MemberAvatar from "./MemberAvatar";

interface MemberListSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export default function MemberListSheet({
  isOpen,
  onClose,
  tripId,
}: MemberListSheetProps) {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useTripMembers(tripId);
  const removeMemberMutation = useRemoveMember(tripId);
  const [targetMemberId, setTargetMemberId] = useState<string | null>(null);
  const {
    open: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const currentMember = members.find((m) => m.user_id === user?.id);
  const isOwner = currentMember?.role === "owner";

  const handleRemoveClick = (memberId: string) => {
    setTargetMemberId(memberId);
    onConfirmOpen();
  };

  const handleConfirmRemove = () => {
    if (!targetMemberId) return;
    removeMemberMutation.mutate(targetMemberId, {
      onSuccess: () => {
        onConfirmClose();
        setTargetMemberId(null);
      },
    });
  };

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title="일행 목록">
        <VStack gap={0} px={4} pb={4} align="stretch">
          {isLoading ? (
            <Text fontSize="sm" color="gray.400" textAlign="center" py={6}>
              불러오는 중...
            </Text>
          ) : members.length === 0 ? (
            <Text fontSize="sm" color="gray.400" textAlign="center" py={6}>
              멤버가 없습니다.
            </Text>
          ) : (
            members.map((member) => {
              const username =
                member.profiles?.username ||
                member.profiles?.email?.split("@")[0] ||
                "알 수 없음";
              const isMe = member.user_id === user?.id;
              const isMemberOwner = member.role === "owner";

              return (
                <HStack
                  key={member.id}
                  py={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  justify="space-between"
                >
                  <HStack gap={3}>
                    <MemberAvatar username={username} />
                    <VStack gap={0} align="start">
                      <HStack gap={1.5}>
                        <Text fontSize="sm" fontWeight="medium">
                          {username}
                        </Text>
                        {isMe && (
                          <Badge
                            size="sm"
                            colorPalette={colors.primary.palette}
                          >
                            나
                          </Badge>
                        )}
                      </HStack>
                      <Text fontSize="xs" color="gray.400">
                        {isMemberOwner ? "방장" : "멤버"}
                      </Text>
                    </VStack>
                  </HStack>

                  {isOwner && !isMe && (
                    <Box
                      as="button"
                      p={2}
                      color="red.400"
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: "red.50" }}
                      onClick={() => handleRemoveClick(member.id)}
                    >
                      <Trash2 size={16} />
                    </Box>
                  )}
                </HStack>
              );
            })
          )}
        </VStack>
      </BottomSheet>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        title="멤버 제거"
        confirmLabel="제거하기"
        onConfirm={handleConfirmRemove}
        isDangerous
        isLoading={removeMemberMutation.isPending}
      >
        <Text>이 멤버를 여행에서 제외 하시겠습니까?</Text>
      </ConfirmDialog>
    </>
  );
}
