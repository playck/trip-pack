import { useState } from "react";
import { VStack, Text, Input, HStack, Button } from "@chakra-ui/react";
import { Link, Copy, Check } from "lucide-react";
import { BottomSheet } from "@/shared/components";
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
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const createInvitation = useCreateInvitation();

  const handleCreateLink = () => {
    createInvitation.mutate(tripId, {
      onSuccess: (data) => {
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/invite/${data.invite_code}`);
      },
    });
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    const ok = await copyToClipboard(inviteLink);
    if (ok) {
      setCopied(true);
      toaster.create({
        title: "초대 링크가 복사되었습니다",
        type: "success",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setInviteLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="일행 초대">
      <VStack gap={5} px={4} pb={4}>
        <VStack gap={2} align="start" w="full">
          <Text fontSize="sm" color="gray.600">
            초대 링크를 생성하여 일행에게 공유하세요.
          </Text>
          <Text fontSize="xs" color="gray.400">
            링크를 받은 사람은 로그인 후 여행에 참가할 수 있습니다.
          </Text>
        </VStack>

        {!inviteLink ? (
          <Button
            w="full"
            size="lg"
            colorPalette={colors.primary.palette}
            onClick={handleCreateLink}
            loading={createInvitation.isPending}
          >
            <Link size={18} />
            초대 링크 생성
          </Button>
        ) : (
          <HStack w="full" gap={2}>
            <Input
              value={inviteLink}
              readOnly
              size="lg"
              borderRadius="xl"
              fontSize="sm"
            />
            <Button
              size="lg"
              colorPalette={copied ? "green" : colors.primary.palette}
              onClick={handleCopy}
              px={4}
              flexShrink={0}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </HStack>
        )}
      </VStack>
    </BottomSheet>
  );
}
