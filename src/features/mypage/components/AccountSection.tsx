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

  const handleConfirm = () => {
    if (dialogConfig.type === "logout") {
      logout();
    } else if (dialogConfig.type === "delete") {
      deleteAccount();
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
          <Text fontSize="sm" fontWeight="bold" color="gray.400">
            앱 정보
          </Text>
          <Text fontSize="xs" color="gray.400">
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
        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
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
            : "정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
        }
        confirmLabel={dialogConfig.type === "logout" ? "로그아웃" : "탈퇴하기"}
        isDangerous={dialogConfig.type === "delete"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
