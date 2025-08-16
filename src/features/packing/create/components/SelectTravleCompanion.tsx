import { Button, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import {
  type CompanionType,
  type CompanionTypeOption,
  COMPANION_TYPE_OPTIONS,
} from "../data/data";
import { componentColors } from "@/shared/constants/colors";

interface TravelCompanionProps {
  value?: CompanionType;
  companionTypes?: CompanionTypeOption[];
  onChange: (companion: CompanionType) => void;
  onCompanionTypesChange: (types: CompanionTypeOption[]) => void;
}

export default function TravelCompanion({
  value,
  companionTypes = [],
  onChange,
  onCompanionTypesChange,
}: TravelCompanionProps) {
  const handleCompanionTypeToggle = (type: CompanionTypeOption) => {
    if (companionTypes.includes(type)) {
      onCompanionTypesChange(companionTypes.filter((t) => t !== type));
    } else {
      onCompanionTypesChange([...companionTypes, type]);
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4} justify="center">
        <Button
          variant={value === "alone" ? "solid" : "outline"}
          colorPalette={componentColors.button.primary}
          borderColor={
            value === "alone"
              ? componentColors.button.primary
              : componentColors.button.border.default
          }
          size="lg"
          flex={1}
          onClick={() => {
            onChange("alone");
            onCompanionTypesChange([]);
          }}
        >
          혼자 떠나요!
        </Button>
        <Button
          variant={value === "withCompanion" ? "solid" : "outline"}
          colorPalette={componentColors.button.primary}
          borderColor={
            value === "withCompanion"
              ? componentColors.button.primary
              : componentColors.button.border.default
          }
          size="lg"
          flex={1}
          onClick={() => onChange("withCompanion")}
        >
          일행이 있어요!
        </Button>
      </HStack>

      {value === "withCompanion" && (
        <VStack gap={4} align="stretch">
          <Text fontSize="md" fontWeight="medium" color="gray.600">
            어떤 일행과 함께 가시나요?
          </Text>
          <Wrap gap={3}>
            {COMPANION_TYPE_OPTIONS.map((type) => (
              <WrapItem key={type}>
                <Button
                  variant={companionTypes.includes(type) ? "solid" : "outline"}
                  colorPalette={componentColors.button.primary}
                  borderColor={
                    companionTypes.includes(type)
                      ? componentColors.button.primary
                      : componentColors.button.border.default
                  }
                  size="sm"
                  onClick={() => handleCompanionTypeToggle(type)}
                >
                  {type}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
      )}
    </VStack>
  );
}
