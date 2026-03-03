import { useState } from "react";
import { VStack, Text, Box } from "@chakra-ui/react";
import { LogOut, UserX, Shield, FileText, Info } from "lucide-react";
import { useAuth } from "@/shared/hooks/useAuth";
import { LEGAL_URLS } from "@/shared/constants/app";
import { openUrl } from "@/shared/utils/nativeMessage";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import type { DialogConfig, DialogType } from "../type";
import MenuItem from "./MenuItem";
import AboutSheet from "./AboutSheet";

export default function AccountSection() {
  const { logout, deleteAccount } = useAuth();
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    isOpen: false,
    type: null,
  });
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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
      <Box>
        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
          앱 정보
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
            icon={Info}
            label="앱 정보"
            onClick={() => setIsAboutOpen(true)}
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

      <AboutSheet
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

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
