import { VStack, Text, HStack, Box, Icon } from "@chakra-ui/react";
import { ChevronRight, LogOut, UserX, Bell, ShieldCheck } from "lucide-react";
import { statusColors } from "@/shared/constants/colors";

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
        <ChevronRight size={18} color="#A0AEC0" />
      </HStack>
    </Box>
  );
}

export default function SettingMenu() {
  return (
    <VStack gap={4} align="stretch">
      <Box>
        <Text fontSize="sm" fontWeight="bold" color="gray.400" mb={2} px={1}>
          계정 설정
        </Text>
        <VStack
          gap={0}
          bg="white"
          borderRadius="xl"
          px={4}
          borderWidth="1px"
          borderColor="gray.100"
        >
          {/* Phase 2에서 기능 연결 예정 */}
          <MenuItem icon={Bell} label="알림 설정" />
          <MenuItem icon={ShieldCheck} label="개인정보 처리방침" />
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
            onClick={() => console.log("Logout")}
          />
          <MenuItem
            icon={UserX}
            label="회원 탈퇴"
            isDestructive
            onClick={() => console.log("Delete Account")}
          />
        </VStack>
      </Box>
    </VStack>
  );
}
