import { Button, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { componentColors } from "@/shared/constants/colors";

import { packingCreateAtom } from "../store/packingCreateAtom";
import {
  type CompanionType,
  type CompanionTypeOption,
  COMPANION_TYPE_OPTIONS,
} from "../data/data";

export default function TravelCompanion() {
  const [packingState, setPackingState] = useAtom(packingCreateAtom);
  const { companion, companionTypes } = packingState;

  const handleCompanionTypeToggle = (type: CompanionTypeOption) => {
    if (companionTypes.includes(type)) {
      setPackingState((prev) => ({
        ...prev,
        companionTypes: companionTypes.filter((t) => t !== type),
      }));
    } else {
      setPackingState((prev) => ({
        ...prev,
        companionTypes: [...companionTypes, type],
      }));
    }
  };

  const handleCompanionChange = (newCompanion: CompanionType) => {
    setPackingState((prev) => ({
      ...prev,
      companion: newCompanion,
      companionTypes: newCompanion === "alone" ? [] : prev.companionTypes,
    }));
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4} justify="center">
        <Button
          variant={companion === "alone" ? "solid" : "outline"}
          colorPalette={componentColors.button.primary}
          borderColor={
            companion === "alone"
              ? componentColors.button.primary
              : componentColors.button.border.default
          }
          size="lg"
          flex={1}
          onClick={() => handleCompanionChange("alone")}
        >
          혼자 떠나요!
        </Button>
        <Button
          variant={companion === "withCompanion" ? "solid" : "outline"}
          colorPalette={componentColors.button.primary}
          borderColor={
            companion === "withCompanion"
              ? componentColors.button.primary
              : componentColors.button.border.default
          }
          size="lg"
          flex={1}
          onClick={() => handleCompanionChange("withCompanion")}
        >
          일행이 있어요!
        </Button>
      </HStack>

      {companion === "withCompanion" && (
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
