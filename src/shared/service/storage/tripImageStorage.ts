import imageCompression from "browser-image-compression";
import { supabase } from "@/shared/service/supabase/cilent";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
};

const BUCKET_NAME = "trip-images";

export const uploadTripImage = async (
  file: File,
  tripId: string,
  userId: string
): Promise<string> => {
  const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

  const timestamp = Date.now();
  const path = `${userId}/${tripId}/${timestamp}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, compressedFile, {
      contentType: compressedFile.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return publicUrl;
};

export const deleteTripImage = async (imageUrl: string): Promise<void> => {
  const bucketPath = imageUrl.split(`${BUCKET_NAME}/`)[1];
  if (!bucketPath) return;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([bucketPath]);

  if (error) {
    console.error("이미지 삭제 실패:", error.message);
  }
};
