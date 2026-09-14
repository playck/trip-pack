import { useMemo } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";

import type { PackingStyle } from "@/shared/data/checkList";

import { packingCreateAtom } from "../store/packingCreateAtom";
import { generateCheckList } from "../utils/generateCheckList";
import ChoiceCard from "./ChoiceCard";

interface StyleOption {
  value: PackingStyle;
  title: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { value: "minimal", title: "아니요, 가볍게" },
  { value: "full", title: "네, 많이" },
];

export default function SelectPackingStyle() {
  const [packingState, setPackingState] = useAtom(packingCreateAtom);
  const selected = packingState.packingStyle ?? "full";

  // 가볍게 가 많이 보다 몇 퍼센트 적은지.
  const lighterPercent = useMemo(() => {
    const count = (style: PackingStyle) =>
      generateCheckList(packingState, style).reduce(
        (total, category) => total + category.items.length,
        0,
      );

    const full = count("full");
    if (full === 0) return 0;

    return Math.round(((full - count("minimal")) / full) * 100);
  }, [packingState]);

  const handleSelect = (style: PackingStyle) => {
    setPackingState((prev) => ({ ...prev, packingStyle: style }));
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack gap={3} align="stretch">
        {STYLE_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.title}
            isSelected={selected === option.value}
            onSelect={() => handleSelect(option.value)}
          />
        ))}
      </HStack>

      <VStack gap={1}>
        {lighterPercent > 0 && (
          <Text fontSize="sm" color="gray.600" textAlign="center">
            {selected === "minimal"
              ? `꼭 필요한 것만 골라 약 ${lighterPercent}% 적게 담아드려요`
              : `가볍게를 고르면 약 ${lighterPercent}% 적게 담아드려요`}
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
