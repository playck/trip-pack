import { Box, HStack, Icon, SegmentGroup, Text } from "@chakra-ui/react";
import { Luggage } from "lucide-react";

import { colors } from "@/shared/constants/colors";
import type { PackingStyle } from "@/shared/data/checkList";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  usePackingStyle,
  useUpdatePackingStyle,
} from "@/shared/service/profile";

const OPTIONS: { value: PackingStyle; label: string }[] = [
  { value: "minimal", label: "가볍게" },
  { value: "full", label: "많이" },
];

// 마이페이지 "체크리스트" 그룹 — 짐 스타일 변경.
// 값이 아직 없으면(NULL) `많이`를 선택된 것으로 보여준다.
export default function PackingStyleSection() {
  const { user } = useAuth();
  const { effectiveStyle } = usePackingStyle(user?.id);
  const update = useUpdatePackingStyle(user?.id);

  if (!user) return null;

  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={2} px={1}>
        체크리스트
      </Text>
      <HStack
        gap={3}
        justify="space-between"
        bg="white"
        borderRadius="xl"
        px={4}
        py={3}
        borderWidth="1px"
        borderColor="gray.200"
      >
        <HStack gap={3}>
          <Icon as={Luggage} color="gray.500" size="lg" />
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            짐 스타일
          </Text>
        </HStack>

        <SegmentGroup.Root
          size="sm"
          colorPalette={colors.primary.palette}
          value={effectiveStyle}
          disabled={update.isPending}
          onValueChange={(details) => {
            const next = details.value as PackingStyle | null;
            if (!next || next === effectiveStyle) return;
            update.mutate(next);
          }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={OPTIONS} />
        </SegmentGroup.Root>
      </HStack>
    </Box>
  );
}
