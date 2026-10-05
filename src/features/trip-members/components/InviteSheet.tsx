import { useCallback, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Center, Spinner } from "@chakra-ui/react";
import { copyToClipboard } from "@/shared/utiles/clipboard";
import { toaster } from "@/shared/components/ui/toaster";
import { colors } from "@/shared/constants/colors";
import { useCreateInvitation } from "../hooks/useInvitation";

interface InviteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripTitle: string;
  /** 표시 이름. 없으면 문구에서 보낸 사람을 뺀다(이메일 노출 방지) */
  inviterName?: string | null;
}

export default function InviteSheet({
  isOpen,
  onClose,
  tripId,
  tripTitle,
  inviterName,
}: InviteSheetProps) {
  const createInvitation = useCreateInvitation();
  const hasMutatedRef = useRef(false);

  const triggerShare = useCallback(
    async (link: string, expiresAt: string | null) => {
      // 단톡방에서 스팸 링크와 구분되도록 누가·어떤 여행에·언제까지 초대했는지 적는다
      const until = expiresAt ? `${dayjs(expiresAt).format("M월 D일")}까지 ` : "";
      const text = `${inviterName ? `${inviterName}님이 ` : ""}'${tripTitle}' 여행에 초대했어요. ${until}링크를 눌러 함께 준비해요!`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${tripTitle} 여행 초대`,
            text,
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
    [onClose, tripTitle, inviterName],
  );

  useEffect(() => {
    if (isOpen && !hasMutatedRef.current) {
      hasMutatedRef.current = true;
      createInvitation.mutate(tripId, {
        onSuccess: (data) => {
          const link = `${window.location.origin}/invite/${data.invite_code}`;
          triggerShare(link, data.expires_at);
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
