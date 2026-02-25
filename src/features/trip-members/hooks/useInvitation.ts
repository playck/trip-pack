import { useMutation, useQuery } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import {
  createInvitation,
  acceptInvitation,
  getInvitationByCode,
} from "../services/api";

export function useCreateInvitation() {
  return useMutation({
    mutationFn: (tripId: string) => createInvitation(tripId),
    onError: (error: Error) => {
      toaster.create({
        title: "초대 링크 생성 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (inviteCode: string) => acceptInvitation(inviteCode),
    onError: (error: Error) => {
      toaster.create({
        title: "초대 수락 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}

export function useInvitationInfo(inviteCode: string) {
  return useQuery({
    queryKey: ["invitation", inviteCode],
    queryFn: () => getInvitationByCode(inviteCode),
    enabled: !!inviteCode,
    retry: false,
  });
}
