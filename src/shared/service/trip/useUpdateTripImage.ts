import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";
import {
  uploadTripImage,
  deleteTripImage,
} from "@/shared/service/storage/tripImageStorage";
import { updateTripImageUrl } from "./api";

interface UpdateTripImageParams {
  tripId: string;
  userId: string;
  file: File;
  currentImageUrl?: string | null;
}

export function useUpdateTripImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tripId,
      userId,
      file,
      currentImageUrl,
    }: UpdateTripImageParams) => {
      const publicUrl = await uploadTripImage(file, tripId, userId);
      await updateTripImageUrl(tripId, publicUrl);

      if (currentImageUrl) {
        await deleteTripImage(currentImageUrl).catch(() => {});
      }

      return publicUrl;
    },
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ["tripInfo", tripId] });
      queryClient.invalidateQueries({ queryKey: ["tripList"] });

      toaster.create({
        title: "여행 이미지가 변경되었습니다",
        type: "success",
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      toaster.create({
        title: "이미지 업로드 실패",
        description: error.message,
        type: "error",
        duration: 3000,
      });
    },
  });
}
