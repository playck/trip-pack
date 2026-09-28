import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toaster } from "@/shared/components/ui/toaster";
import { cancelTripNotification } from "@/shared/utils/nativeMessage";
import {
  getTripMembers,
  leaveTrip,
  removeMember,
  transferTripOwnership,
} from "../services/api";

export const tripMemberKeys = {
  members: (tripId: string) => ["tripMembers", tripId] as const,
};

export function useTripMembers(tripId: string) {
  return useQuery({
    queryKey: tripMemberKeys.members(tripId),
    queryFn: () => getTripMembers(tripId),
    enabled: !!tripId,
    meta: { persist: true }, // 오프라인 읽기: 여행 윈도우 내 멤버 목록 persist
  });
}

export function useMemberProfileMap(tripId: string) {
  const { data: members = [] } = useTripMembers(tripId);

  return useMemo(() => {
    const map = new Map<string, string>();
    members.forEach((m) => {
      map.set(
        m.user_id,
        m.profiles?.username || m.profiles?.email || "알 수 없음",
      );
    });
    return map;
  }, [members]);
}

export function useRemoveMember(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripMemberKeys.members(tripId),
      });
      toaster.create({
        title: "멤버가 제거되었습니다",
        type: "success",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "멤버 제거 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useTransferOwnership(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newOwnerUserId: string) =>
      transferTripOwnership(tripId, newOwnerUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tripMemberKeys.members(tripId),
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "방장 넘기기 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useLeaveTrip(tripId: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => leaveTrip(tripId),
    onSuccess: () => {
      // 나간 여행의 리마인더가 이 기기에 계속 오지 않게 취소
      cancelTripNotification({ tripId });
      queryClient.invalidateQueries({ queryKey: ["tripList"] });
      toaster.create({
        title: "여행에서 나왔어요",
        description: "내가 적은 경비·할 일은 일행에게 그대로 남아요.",
        type: "success",
        duration: 3000,
      });
      navigate({ to: "/main" });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "여행 나가기 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}
