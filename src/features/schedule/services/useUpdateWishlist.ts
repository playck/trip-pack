import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { updateWishlist } from "./wishlistApi";
import type { UpdateWishlistParams } from "../types";

export const useUpdateWishlist = (tripId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateWishlistParams) => updateWishlist(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });

      toaster.create({
        title: "가고 싶은 곳이 수정되었습니다",
        type: "success",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "가고 싶은 곳 수정 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    },
  });
};
