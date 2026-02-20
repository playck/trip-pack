import { VStack, Text, Box } from "@chakra-ui/react";
import { Map, ClipboardList } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import MenuItem from "./MenuItem";

export default function ActivitySection() {
  const navigate = useNavigate();

  return (
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
        borderColor="gray.200"
      >
        <MenuItem
          icon={Map}
          label="지난 여행 보기"
          onClick={() => navigate({ to: "/mypage/past-trips" })}
        />
        <MenuItem
          icon={ClipboardList}
          label="체크리스트 목록"
          onClick={() => navigate({ to: "/mypage/my-checklists" })}
        />
      </VStack>
    </Box>
  );
}
