import { Dialog, Text, VStack, HStack, Box, Badge } from "@chakra-ui/react";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Luggage,
  Briefcase,
  Globe,
} from "lucide-react";
import type { CountryRestriction } from "@/shared/data/baggagePolicyData";
import type { CabinPolicy } from "@/shared/data/checkList";

interface CabinPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  policy: CabinPolicy | null | undefined;
  cabinNotes?: string | null;
  checkedPolicy?: CabinPolicy | null | undefined;
  checkedNotes?: string | null;
  countryWarning?: CountryRestriction | null;
}

export default function CabinPolicyModal({
  isOpen,
  onClose,
  itemName,
  policy,
  cabinNotes,
  checkedPolicy,
  checkedNotes,
  countryWarning,
}: CabinPolicyModalProps) {
  const getPolicyConfig = (policyStatus: CabinPolicy | null | undefined) => {
    switch (policyStatus) {
      case "allowed":
        return {
          icon: CheckCircle,
          color: "green.500",
          text: "가능",
          bg: "green.50",
        };
      case "restricted":
        return {
          icon: AlertTriangle,
          color: "orange.500",
          text: "제한/주의",
          bg: "orange.50",
        };
      case "prohibited":
        return {
          icon: Ban,
          color: "red.500",
          text: "불가",
          bg: "red.50",
        };
      default:
        return {
          icon: CheckCircle,
          color: "gray.400",
          text: "정보 없음",
          bg: "gray.50",
        };
    }
  };

  const cabinConfig = getPolicyConfig(policy);
  const checkedConfig = getPolicyConfig(checkedPolicy);

  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Dialog.Content maxW="sm" mx={4} borderRadius="xl">
          <Dialog.Header pb={1}>
            <Dialog.Title fontSize="xl" fontWeight="bold">
              {itemName}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body pb={6}>
            <VStack align="stretch" gap={2}>
              {/* 국가별 경고 섹션 */}
              {countryWarning && (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="red.500"
                  bg="red.50"
                  p={4}
                >
                  <HStack mb={2} color="red.600">
                    <Globe size={20} />
                    <Text fontWeight="bold">
                      {countryWarning.countryName} 반입 주의
                    </Text>
                    <Badge colorScheme="red" ml="auto">
                      {countryWarning.status === "prohibited"
                        ? "반입 금지"
                        : "주의"}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.800" fontWeight="medium">
                    {countryWarning.message}
                  </Text>
                </Box>
              )}

              {/* 기내 수하물 섹션 */}
              <Box
                borderWidth="1px"
                borderRadius="lg"
                borderColor={cabinConfig.color}
                bg={cabinConfig.bg}
                p={4}
              >
                <HStack mb={2} color={cabinConfig.color}>
                  <Briefcase size={20} />
                  <Text fontWeight="bold">기내 수하물</Text>
                  <HStack ml="auto" gap={1}>
                    <cabinConfig.icon size={16} />
                    <Text fontWeight="bold" fontSize="sm">
                      {cabinConfig.text}
                    </Text>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                  {cabinNotes || "기내 반입 관련 특별한 주의사항이 없습니다."}
                </Text>
              </Box>

              {/* 위탁 수하물 섹션 */}
              {(checkedPolicy || checkedNotes) && (
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={checkedConfig.color}
                  bg={checkedConfig.bg}
                  p={4}
                >
                  <HStack mb={2} color={checkedConfig.color}>
                    <Luggage size={20} />
                    <Text fontWeight="bold">위탁 수하물</Text>
                    <HStack ml="auto" gap={1}>
                      <checkedConfig.icon size={16} />
                      <Text fontWeight="bold" fontSize="sm">
                        {checkedConfig.text}
                      </Text>
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                    {checkedNotes ||
                      "위탁 운송 관련 특별한 주의사항이 없습니다."}
                  </Text>
                </Box>
              )}

              <Box bg="gray.50" p={3} borderRadius="md">
                <HStack align="start" gap={1.5}>
                  <Text fontSize="xs" lineHeight="1.4">💡</Text>
                  <Text fontSize="xs" color="gray.500" lineHeight="1.4">
                    항공사별로 규정이 다를 수 있으니, 출발 전 해당 항공사의
                    최신 규정을 확인해주세요.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
