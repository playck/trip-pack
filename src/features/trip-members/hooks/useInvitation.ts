import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createInvitation, acceptInvitation } from "../services/api";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteCode: string) => acceptInvitation(inviteCode),
    onSuccess: ({ tripTitle }) => {
      // 홈 목록은 5분 캐시라 방금 합류한 여행이 안 보일 수 있다
      queryClient.invalidateQueries({ queryKey: ["tripList"] });
      toaster.create({
        title: `'${tripTitle}' 여행에 참가했어요`,
        description: "일정·경비는 일행과 함께 보고, 짐 목록은 각자 만들어요.",
        type: "success",
        duration: 4000,
      });
    },
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
