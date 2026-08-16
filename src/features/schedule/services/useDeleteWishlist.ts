import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import { deleteWishlist } from "./wishlistApi";

interface UseDeleteWishlistOptions {
  onSuccess?: () => void;
}

export const useDeleteWishlist = (
  tripId: string,
  options?: UseDeleteWishlistOptions
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (wishlistId: string) => deleteWishlist(wishlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tripWishlists", tripId],
      });

      toaster.create({
        title: "가고 싶은 곳에서 제거했어요",
        type: "success",
        duration: 1500,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      toaster.create({
        title: "가고 싶은 곳 제거 실패",
        description: error.message || "다시 시도해주세요.",
        type: "error",
        duration: 3000,
      });
    },
  });
};
