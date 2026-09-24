import { Box, Text, VStack } from "@chakra-ui/react";

import { PassportExpiryRow } from "@/features/passport";

import PackingStyleRow from "./PackingStyleRow";

/**
 * 마이페이지 "내 정보" 그룹.
 *
 * 한 번 넣어두면 **앞으로 만드는 여행에 알아서 쓰이는 값**들을 모은다.
 * 조회 도구인 `TravelHelperSection`("여행 도우미")과 나누는 기준이 그것이다.
 */
export default function MyInfoSection() {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2} px={1}>
        내 정보
      </Text>
      <VStack
        gap={0}
        bg="white"
        borderRadius="xl"
        px={4}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <PassportExpiryRow />
        <PackingStyleRow />
      </VStack>
    </Box>
  );
}
