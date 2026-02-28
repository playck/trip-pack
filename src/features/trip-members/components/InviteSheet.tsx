import { useCallback, useEffect, useRef } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { copyToClipboard } from "@/shared/utiles/clipboard";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useCreateInvitation } from "../hooks/useInvitation";

interface InviteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
}

export default function InviteSheet({
  isOpen,
  onClose,
  tripId,
}: InviteSheetProps) {
  const createInvitation = useCreateInvitation();
  const hasMutatedRef = useRef(false);

  const triggerShare = useCallback(
    async (link: string) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "여행 초대",
            text: "함께 여행을 준비해요!",
            url: link,
          });
        } catch (error) {
          // 사용자가 공유를 취소한 경우 무시
          if (error instanceof Error && error.name !== "AbortError") {
            await fallbackCopy(link);
          }
        }
      } else {
        await fallbackCopy(link);
      }
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen && !hasMutatedRef.current) {
      hasMutatedRef.current = true;
      createInvitation.mutate(tripId, {
        onSuccess: (data) => {
          const link = `${window.location.origin}/invite/${data.invite_code}`;
          triggerShare(link);
        },
        onError: () => {
          onClose();
        },
      });
    }
    if (!isOpen) {
      hasMutatedRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen || !createInvitation.isPending) return null;

  return (
    <Center position="fixed" inset={0} zIndex="overlay" bg="blackAlpha.300">
      <Spinner size="xl" color={colors.primary.solid} />
    </Center>
  );
}

async function fallbackCopy(link: string) {
  const ok = await copyToClipboard(link);
  if (ok) {
    toaster.create({
      title: "초대 링크가 복사되었습니다",
      type: "success",
      duration: 2000,
    });
  }
}
