import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { createWishlist } from "./wishlistApi";
import type { CreateWishlistParams } from "../types";

interface UseCreateWishlistOptions {
  onSuccess?: (data: { id: string }) => void;
  onError?: (error: Error) => void;
}

export const useCreateWishlist = (
  tripId: string,
  options?: UseCreateWishlistOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateWishlistParams) => createWishlist(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });

      toaster.create({
        title: "가고 싶은 곳에 담았어요",
        type: "success",
        duration: 1500,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toaster.create({
        title: "가고 싶은 곳 추가 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
};
