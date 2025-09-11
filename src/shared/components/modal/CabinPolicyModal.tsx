import { Dialog, Text, VStack, HStack, Box } from "@chakra-ui/react";
import { AlertTriangle, Ban, CheckCircle } from "lucide-react";

export type CabinPolicy = "allowed" | "restricted" | "prohibited";

interface CabinPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  policy: CabinPolicy | null | undefined;
  cabinNotes?: string | null;
}

export default function CabinPolicyModal({
  isOpen,
  onClose,
  itemName,
  policy,
  cabinNotes,
}: CabinPolicyModalProps) {
  const getPolicyInfo = () => {
    switch (policy) {
      case "allowed":
        return {
          icon: CheckCircle,
          color: "green.500",
          title: "기내 반입 허용",
          description: "이 물품은 기내 수화물로 반입이 가능합니다.",
        };
      case "restricted":
        return {
          icon: AlertTriangle,
          color: "orange.500",
          title: "기내 반입 제한",
          description:
            "이 물품은 기내 반입에 제한이 있습니다. 항공사 규정을 확인해주세요.",
        };
      case "prohibited":
        return {
          icon: Ban,
          color: "red.500",
          title: "기내 반입 금지",
          description:
            "이 물품은 기내 수화물로 반입이 금지되어 있습니다. 위탁 수하물로만 운송 가능합니다.",
        };
      default:
        return {
          icon: CheckCircle,
          color: "gray.500",
          title: "정보 없음",
          description: "기내 수화물 정책 정보가 없습니다.",
        };
    }
  };

  const policyInfo = getPolicyInfo();
  const { icon: IconComponent, color, title, description } = policyInfo;

  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Dialog.Content maxW="sm" mx={4}>
          <Dialog.Header pb={2}>
            <HStack gap={2}>
              <Box color={color}>
                <IconComponent size={24} />
              </Box>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                {title}
              </Dialog.Title>
            </HStack>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body pb={6}>
            <VStack align="stretch" gap={3}>
              <Box>
                <Text fontSize="md" fontWeight="medium" mb={2}>
                  {itemName}
                </Text>
                <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                  {description}
                </Text>
              </Box>

              {cabinNotes && (
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb={1}
                    color="gray.700"
                  >
                    정보
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                    {cabinNotes}
                  </Text>
                </Box>
              )}

              <Box bg="gray.50" p={3} borderRadius="md">
                <Text fontSize="xs" color="gray.500" lineHeight="1.4">
                  💡 항공사별로 규정이 다를 수 있으니, 출발 전 해당 항공사의
                  최신 규정을 확인해주세요.
                </Text>
              </Box>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
