import { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { VStack, Text, HStack, Box, Badge, Button } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { BottomSheet, ConfirmDialog } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import { useAuth } from "@/shared/hooks/useAuth";
import { colors, statusColors, textColors } from "@/shared/constants/colors";
import {
  useTripMembers,
  useRemoveMember,
  useTransferOwnership,
  useLeaveTrip,
} from "../hooks/useTripMembers";
import type { TripMemberWithProfile } from "../services/api";
import MemberAvatar from "./MemberAvatar";

interface MemberListSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  /** 삭제 모달의 '방장 넘기고 나가기'로 열었을 때 바로 새 방장 선택 단계로 시작 */
  startWithTransferAndLeave?: boolean;
}

const getMemberName = (member: TripMemberWithProfile) =>
  member.profiles?.username ||
  member.profiles?.email?.split("@")[0] ||
  "알 수 없음";

export default function MemberListSheet({
  isOpen,
  onClose,
  tripId,
  startWithTransferAndLeave = false,
}: MemberListSheetProps) {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useTripMembers(tripId);
  const removeMemberMutation = useRemoveMember(tripId);
  const transferMutation = useTransferOwnership(tripId);
  const leaveMutation = useLeaveTrip(tripId);

  const [targetMemberId, setTargetMemberId] = useState<string | null>(null);
  const {
    open: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  // 방장 넘기기: 목록 → 새 방장 선택 → 확인. leaveAfterTransfer면 넘긴 뒤 바로 나간다.
  const [isPickingOwner, setIsPickingOwner] = useState(false);
  const [leaveAfterTransfer, setLeaveAfterTransfer] = useState(false);
  const [newOwner, setNewOwner] = useState<TripMemberWithProfile | null>(null);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsPickingOwner(startWithTransferAndLeave);
      setLeaveAfterTransfer(startWithTransferAndLeave);
      setNewOwner(null);
    }
  }, [isOpen, startWithTransferAndLeave]);

  const currentMember = members.find((m) => m.user_id === user?.id);
  const isOwner = currentMember?.role === "owner";
  const otherMembers = members.filter((m) => m.user_id !== user?.id);

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

  const startPickingOwner = (leave: boolean) => {
    setLeaveAfterTransfer(leave);
    setIsPickingOwner(true);
  };

  // 방장은 여행당 1명이라 바로 나갈 수 없다 — 새 방장을 고르게 한다
  const handleLeaveClick = () => {
    if (isOwner) startPickingOwner(true);
    else setIsLeaveConfirmOpen(true);
  };

  const handleConfirmTransfer = async () => {
    if (!newOwner) return;
    try {
      await transferMutation.mutateAsync(newOwner.user_id);
      if (leaveAfterTransfer) {
        await leaveMutation.mutateAsync();
        return;
      }
      toaster.create({
        title: `${getMemberName(newOwner)}님이 새 방장이 됐어요`,
        type: "success",
        duration: 2000,
      });
      setNewOwner(null);
      setIsPickingOwner(false);
    } catch {
      // 실패 안내는 각 mutation의 onError 토스트가 한다
    }
  };

  const isTransferring = transferMutation.isPending || leaveMutation.isPending;
  // 혼자인 방장은 나갈 수 없다(나가기 = 삭제) — 버튼을 숨기고 삭제만 남긴다
  const canLeave = !isLoading && (!isOwner || otherMembers.length > 0);

  const memberList = members.map((member) => {
    const username = getMemberName(member);
    const isMe = member.user_id === user?.id;
    const isMemberOwner = member.role === "owner";

    return (
      <HStack
        key={member.id}
        py={3}
        borderBottom={
          member.id === members[members.length - 1].id ? "none" : "1px solid"
        }
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
                <Badge size="sm" colorPalette={colors.primary.palette}>
                  나
                </Badge>
              )}
            </HStack>
            <Text fontSize="xs" color="gray.500">
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
  });

  const ownerPicker = (
    <>
      <Text fontSize="sm" color={textColors.secondary} pb={2}>
        {leaveAfterTransfer
          ? "방장은 바로 나갈 수 없어요. 새 방장을 고르면 방장을 넘기고 여행에서 나가요. 여행과 일행의 기록은 그대로 남아요."
          : "새 방장은 여행 제목·기간·사진을 바꾸고 여행을 삭제할 수 있어요. 나는 일행으로 남아요."}
      </Text>
      {otherMembers.map((member) => {
        const username = getMemberName(member);
        const daysTogether = member.joined_at
          ? dayjs().diff(dayjs(member.joined_at), "day")
          : null;
        return (
          <HStack
            key={member.id}
            as="button"
            w="full"
            py={3}
            gap={3}
            borderBottom="1px solid"
            borderColor="gray.100"
            textAlign="left"
            cursor="pointer"
            onClick={() => setNewOwner(member)}
          >
            <MemberAvatar username={username} />
            <VStack gap={0} align="start">
              <Text fontSize="sm" fontWeight="medium">
                {username}
              </Text>
              {daysTogether !== null && (
                <Text fontSize="xs" color="gray.500">
                  함께한 지 {daysTogether + 1}일
                </Text>
              )}
            </VStack>
          </HStack>
        );
      })}
    </>
  );

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        onBack={isPickingOwner ? () => setIsPickingOwner(false) : undefined}
        title={
          !isPickingOwner
            ? "일행 목록"
            : leaveAfterTransfer
              ? "방장 넘기고 나가기"
              : "새 방장 선택"
        }
        size="min"
      >
        <VStack gap={0} px={4} pb={4} align="stretch">
          {isLoading ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
              불러오는 중...
            </Text>
          ) : members.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
              멤버가 없습니다.
            </Text>
          ) : isPickingOwner ? (
            ownerPicker
          ) : (
            <>
              {memberList}
              {canLeave && (
                <HStack gap={2} pt={4}>
                  {isOwner && (
                    <Button
                      flex={1}
                      variant="outline"
                      onClick={() => startPickingOwner(false)}
                    >
                      방장 넘기기
                    </Button>
                  )}
                  <Button
                    flex={1}
                    variant="ghost"
                    color={statusColors.error.text}
                    onClick={handleLeaveClick}
                  >
                    여행 나가기
                  </Button>
                </HStack>
              )}
            </>
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

      {/* 방장 넘기기는 데이터가 사라지지 않아 기본색(틸) 확인 */}
      <ConfirmDialog
        isOpen={!!newOwner}
        onClose={() => setNewOwner(null)}
        title={leaveAfterTransfer ? "방장 넘기고 나가기" : "방장 넘기기"}
        confirmLabel={leaveAfterTransfer ? "넘기고 나가기" : "넘기기"}
        onConfirm={handleConfirmTransfer}
        isLoading={isTransferring}
        message={
          newOwner
            ? leaveAfterTransfer
              ? `${getMemberName(newOwner)}님에게 방장을 넘기고 여행에서 나갈까요? 다시 들어오려면 초대 링크가 필요해요.`
              : `${getMemberName(newOwner)}님을 새 방장으로 지정할까요?`
            : undefined
        }
      />

      <ConfirmDialog
        isOpen={isLeaveConfirmOpen}
        onClose={() => setIsLeaveConfirmOpen(false)}
        title="여행 나가기"
        confirmLabel="나가기"
        onConfirm={() => leaveMutation.mutate()}
        isDangerous
        isLoading={leaveMutation.isPending}
        message="나가면 이 여행을 더 볼 수 없어요. 내가 적은 경비·할 일은 일행에게 그대로 남고, 다시 들어오려면 초대 링크가 필요해요."
      />
    </>
  );
}
