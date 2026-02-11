import { useState } from "react";
import { VStack, Text, HStack, Box, Icon } from "@chakra-ui/react";
import { ChevronRight, LogOut, UserX, Map, ClipboardList } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { systemColors, statusColors } from "@/shared/constants/colors";
import { useAuth } from "@/shared/hooks/useAuth";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import type { DialogConfig, DialogType } from "../type";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  isDestructive?: boolean;
}

function MenuItem({
  icon: IconComponent,
  label,
  onClick,
  isDestructive,
}: MenuItemProps) {
  return (
    <Box
      as="button"
      w="full"
      onClick={onClick}
      py={4}
      px={1}
      borderBottomWidth="1px"
      borderColor="gray.100"
      _last={{ borderBottomWidth: 0 }}
      _active={{ opacity: 0.7 }}
    >
      <HStack justify="space-between" w="full">
        <HStack gap={3}>
          <Icon
            as={IconComponent}
            color={isDestructive ? statusColors.error.palette : "gray.500"}
            size="lg"
          />
          <Text
            fontSize="md"
            fontWeight={isDestructive ? "semibold" : "medium"}
            color={isDestructive ? statusColors.error.palette : "gray.700"}
          >
            {label}
          </Text>
        </HStack>
        <ChevronRight size={18} color={systemColors.text.subtle} />
      </HStack>
    </Box>
  );
}

export default function SettingMenu() {
  const navigate = useNavigate();
  const { logout, deleteAccount } = useAuth();
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

  const goToPastTripsPage = () => {
    navigate({ to: "/mypage/past-trips" });
  };

  const goToMyChecklistsPage = () => {
    navigate({ to: "/mypage/my-checklists" });
  };

  return (
    <>
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
            내 활동
          </Text>
          <VStack
            gap={0}
            bg="white"
            borderRadius="xl"
            px={4}
            borderWidth="1px"
            borderColor="gray.100"
          >
            <MenuItem
              icon={Map}
              label="지난 여행 보기"
              onClick={goToPastTripsPage}
            />
            <MenuItem
              icon={ClipboardList}
              label="체크리스트 목록"
              onClick={goToMyChecklistsPage}
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
            borderColor="gray.100"
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
      </VStack>

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
