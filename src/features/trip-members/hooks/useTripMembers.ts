import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { getTripMembers, removeMember } from "../services/api";

export const tripMemberKeys = {
  members: (tripId: string) => ["tripMembers", tripId] as const,
};

export function useTripMembers(tripId: string) {
  return useQuery({
    queryKey: tripMemberKeys.members(tripId),
    queryFn: () => getTripMembers(tripId),
    enabled: !!tripId,
  });
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
