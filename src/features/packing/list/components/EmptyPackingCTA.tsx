import { Button, Text, VStack } from "@chakra-ui/react";

import { colors } from "@/shared/constants/colors";

import { useCreatePersonalChecklist } from "../hooks/useCreatePersonalChecklist";

interface EmptyPackingCTAProps {
  tripId: string;
}

export default function EmptyPackingCTA({ tripId }: EmptyPackingCTAProps) {
  const mutation = useCreatePersonalChecklist(tripId);

  return (
    <VStack pt={6} gap={2}>
      <Button
        colorPalette={colors.primary.palette}
        loading={mutation.isPending}
        onClick={() => mutation.mutate()}
      >
        나의 짐 체크리스트 만들기
      </Button>
      <Text fontSize="xs" color="gray.500">
        해당 여행 정보로 체크리스트를 생성 해 보세요.
      </Text>
    </VStack>
  );
}
