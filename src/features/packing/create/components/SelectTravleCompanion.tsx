import { Button, HStack, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { componentColors } from "@/shared/constants/colors";

import { packingCreateAtom } from "../store/packingCreateAtom";
import ChoiceCard from "./ChoiceCard";
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
      {/* 5단계 짐 스타일과 같은 종류의 질문이라 같은 컨트롤을 쓴다 */}
      <HStack gap={3} align="stretch">
        <ChoiceCard
          label="🧑 혼자 떠나요"
          isSelected={companion === "alone"}
          onSelect={() => handleCompanionChange("alone")}
        />
        <ChoiceCard
          label="👥 일행이 있어요"
          isSelected={companion === "withCompanion"}
          onSelect={() => handleCompanionChange("withCompanion")}
        />
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
