import { Box, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { BookUser } from "lucide-react";
import dayjs from "dayjs";
import { useAtom } from "jotai";

import { colors } from "@/shared/constants/colors";
import { passportExpiryAtom } from "@/shared/store/passportStore";

/** 여권 최장 유효기간이 10년이라 그보다 조금 넉넉하게 잡는다. */
const MAX_YEARS_AHEAD = 11;

/**
 * 여권 만료일 입력 행. 카드와 그룹 제목은 감싸는 쪽이 그린다.
 *
 * 날짜 하나를 받자고 바텀시트를 띄우지 않는다. 행에서 바로 입력한다
 * (`TodoItemForm` 과 같은 방식). Chakra v3·ark-ui 에 날짜 선택 컴포넌트가
 * 없어서 네이티브 `<input type="date">` 를 쓴다 — OS 기본 피커가 뜬다.
 *
 * 잔여 기간은 여기서 말하지 않는다. 경고는 짐 목록 배너가 여행 출발일을 기준으로
 * 하므로, 여기서까지 개월 수를 띄우면 기준이 둘로 갈려 혼란만 준다.
 */
export default function PassportExpiryRow() {
  const [expiryDate, setExpiryDate] = useAtom(passportExpiryAtom);

  const today = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(MAX_YEARS_AHEAD, "year").format("YYYY-MM-DD");

  const handleChange = (value: string) => {
    // 비우면 등록 해제. 범위를 벗어난 값은 저장하지 않는다
    // (직접 입력·자동완성으로 브라우저 min/max 를 넘길 수 있다).
    if (!value) {
      setExpiryDate(null);
      return;
    }
    if (!dayjs(value).isValid() || value <= today || value > maxDate) return;

    setExpiryDate(value);
  };

  return (
    <Box
      w="full"
      py={3}
      borderBottomWidth="1px"
      borderColor="gray.200"
      _last={{ borderBottomWidth: 0 }}
    >
      <HStack gap={3} justify="space-between">
        <HStack gap={3} flexShrink={0}>
          <Icon as={BookUser} color="gray.500" size="lg" />
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            여권 만료일
          </Text>
        </HStack>

        <Input
          type="date"
          aria-label="여권 만료일"
          value={expiryDate ?? ""}
          min={today}
          max={maxDate}
          size="sm"
          w="auto"
          borderRadius="md"
          _focus={{
            borderColor: colors.primary.solid,
            boxShadow: colors.primary.focusRing,
          }}
          // 네이티브 달력 아이콘을 숨긴다. 의사요소라 시스템 프롭으로는 안 된다.
          css={{ "&::-webkit-calendar-picker-indicator": { display: "none" } }}
          // 아이콘을 숨기면 데스크톱 Chrome 에서 피커를 열 수단이 사라진다.
          // 칸 아무 데나 눌러도 열리게 한다(모바일은 원래 그렇게 동작한다).
          onClick={(e) => e.currentTarget.showPicker?.()}
          onChange={(e) => handleChange(e.target.value)}
        />
      </HStack>
    </Box>
  );
}
