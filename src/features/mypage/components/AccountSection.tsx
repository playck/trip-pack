import { useState } from "react";
import { VStack, Text, Box, HStack } from "@chakra-ui/react";
import { LogOut, UserX, Shield, FileText, Receipt } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { APP_VERSION, LEGAL_URLS, PAYMENT_LIVE } from "@/shared/constants/app";
import { openUrl } from "@/shared/utils/nativeMessage";
import PremiumCard from "@/features/subscription/components/PremiumCard";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import type { DialogConfig, DialogType } from "../type";
import MenuItem from "./MenuItem";

interface AccountSectionProps {
  /** 프리미엄 이용 중이면 업그레이드 카드를 숨긴다(뱃지로 대체). */
  isPremium?: boolean;
}

export default function AccountSection({
  isPremium = false,
}: AccountSectionProps) {
  const { logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    isOpen: false,
    type: null,
  });

  const openDialog = (type: DialogType) => {
    setDialogConfig({ isOpen: true, type });
  };

  const closeDialog = () => {
    setDialogConfig({ isOpen: false, type: null });
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (dialogConfig.type === "logout") {
      logout();
    } else if (dialogConfig.type === "delete") {
      setIsDeleting(true);
      try {
        await deleteAccount();
      } catch {
        // 실패 안내는 deleteAccount의 토스트가 한다
      } finally {
        setIsDeleting(false);
      }
    }
    closeDialog();
  };

  const handleOpenUrl = (url: string) => {
    if (window.ReactNativeWebView) {
      openUrl(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      {PAYMENT_LIVE && !isPremium && (
        <PremiumCard onClick={() => navigate({ to: "/subscribe" })} />
      )}

      <Box>
        <HStack gap={1.5} mb={2} px={1} align="baseline">
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            앱 정보
          </Text>
          <Text fontSize="xs" color="gray.500">
            v{APP_VERSION}
          </Text>
        </HStack>
        <VStack
          gap={0}
          bg="white"
          borderRadius="xl"
          px={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <MenuItem
            icon={Shield}
            label="개인정보 처리방침"
            onClick={() => handleOpenUrl(LEGAL_URLS.PRIVACY_POLICY)}
          />
          <MenuItem
            icon={FileText}
            label="이용약관"
            onClick={() => handleOpenUrl(LEGAL_URLS.TERMS_OF_SERVICE)}
          />
          <MenuItem
            icon={Receipt}
            label="환불정책"
            onClick={() => handleOpenUrl(LEGAL_URLS.REFUND_POLICY)}
          />
        </VStack>
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2} px={1}>
          계정 관리
        </Text>
        <VStack
          gap={0}
          bg="white"
          borderRadius="xl"
          px={4}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <MenuItem
            icon={LogOut}
            label="로그아웃"
            onClick={() => openDialog("logout")}
          />
          <MenuItem
            icon={UserX}
            label="회원 탈퇴"
            isDestructive
            onClick={() => openDialog("delete")}
          />
        </VStack>
      </Box>

      <ConfirmDialog
        isOpen={dialogConfig.isOpen}
        onClose={closeDialog}
        title={dialogConfig.type === "logout" ? "로그아웃" : "회원 탈퇴"}
        message={
          dialogConfig.type === "logout"
            ? "정말 로그아웃 하시겠습니까?"
            : "탈퇴하면 계정과 혼자 쓰던 여행·템플릿이 삭제되며 복구할 수 없어요. 일행이 있는 여행은 가장 먼저 함께한 일행이 방장을 이어받고, 내가 적은 경비·할 일은 일행에게 남아요. 프리미엄은 같은 Apple ID로 다시 가입해 '구매 복원'하면 되살릴 수 있어요."
        }
        confirmLabel={dialogConfig.type === "logout" ? "로그아웃" : "탈퇴하기"}
        isDangerous={dialogConfig.type === "delete"}
        isLoading={isDeleting}
        onConfirm={handleConfirm}
      />
    </>
  );
}
