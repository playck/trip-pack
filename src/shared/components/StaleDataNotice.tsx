import { Text } from "@chakra-ui/react";
import { statusColors } from "@/shared/constants/colors";

interface StaleDataNoticeProps {
  message?: string;
}

/**
 * 캐시 데이터는 그대로 보여 주면서, 최신화(재조회)만 실패했다고 알리는 한 줄 안내.
 * 여행 중 약한 네트워크에서 목록 전체를 오류 화면으로 가리지 않기 위해 쓴다.
 */
export default function StaleDataNotice({
  message = "최신 정보를 불러오지 못했어요. 마지막으로 불러온 내용을 보여 드려요.",
}: StaleDataNoticeProps) {
  return (
    <Text
      w="full"
      px={3}
      py={2}
      fontSize="xs"
      borderRadius="md"
      bg={statusColors.warning.bg}
      color={statusColors.warning.text}
    >
      {message}
    </Text>
  );
}
