import { Text, VStack, HStack, Box, Badge } from "@chakra-ui/react";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Briefcase,
  Luggage,
  Globe,
} from "lucide-react";
import type { CabinCheckItem } from "@/shared/data/baggagePolicyData";

type TransportStatus = "allowed" | "prohibited" | "restricted";

const getPolicyConfig = (status: TransportStatus) => {
  switch (status) {
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
  }
};

interface BaggageRuleResultProps {
  item: CabinCheckItem;
}

export default function BaggageRuleResult({ item }: BaggageRuleResultProps) {
  const cabinConfig = getPolicyConfig(item.cabin.status);
  const checkedConfig = getPolicyConfig(item.checked.status);

  return (
    <VStack align="stretch" gap={2}>
      <Box>
        <Text fontSize="md" fontWeight="bold" color="gray.800">
          {item.name}
        </Text>
        <Text fontSize="sm" color="gray.500" mt={1}>
          {item.description}
        </Text>
      </Box>

      {/* 기내 수하물 */}
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
          {item.cabin.reason}
        </Text>
      </Box>

      {/* 위탁 수하물 */}
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
          {item.checked.reason}
        </Text>
      </Box>

      {/* 국가별 주의사항 */}
      {item.countryRestrictions && item.countryRestrictions.length > 0 && (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderColor="red.500"
          bg="red.50"
          p={4}
        >
          <HStack mb={2} color="red.600">
            <Globe size={20} />
            <Text fontWeight="bold">국가별 주의사항</Text>
          </HStack>
          <VStack align="stretch" gap={2}>
            {item.countryRestrictions.map((restriction) => (
              <HStack key={restriction.countryCode} align="start" gap={2}>
                <Badge
                  colorPalette={
                    restriction.status === "prohibited" ? "red" : "orange"
                  }
                  variant="subtle"
                  flexShrink={0}
                  mt={0.5}
                >
                  {restriction.countryName}
                </Badge>
                <Text fontSize="sm" color="gray.700" lineHeight="1.5">
                  {restriction.message}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      <Box bg="gray.50" p={3} borderRadius="md">
        <HStack align="start" gap={1.5}>
          <Text fontSize="xs" lineHeight="1.4">💡</Text>
          <Text fontSize="xs" color="gray.500" lineHeight="1.4">
            항공사별로 규정이 다를 수 있으니, 출발 전 해당 항공사의 최신 규정을
            확인해주세요.
          </Text>
        </HStack>
      </Box>
    </VStack>
  );
}
