import { Button, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { type TripTypeOption, TRIP_TYPE_OPTIONS } from "../data/data";
import { componentColors } from "@/shared/constants/colors";

interface SelectTripTypeProps {
  value?: TripTypeOption[];
  onChange: (tripTypes: TripTypeOption[]) => void;
}

export default function SelectTripType({
  value = [],
  onChange,
}: SelectTripTypeProps) {
  const handleTripTypeToggle = (type: TripTypeOption) => {
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <Text fontSize="lg" fontWeight="bold">
        어떤 여행을 떠나시나요?
      </Text>

      <VStack gap={4} align="stretch">
        <Text fontSize="md" fontWeight="medium" color="gray.600">
          여행 유형을 선택해주세요 (여러개 선택 가능)
        </Text>
        <Wrap gap={3}>
          {TRIP_TYPE_OPTIONS.map((type) => (
            <WrapItem key={type}>
              <Button
                variant={value.includes(type) ? "solid" : "outline"}
                colorPalette={componentColors.button.primary}
                borderColor={
                  value.includes(type)
                    ? componentColors.button.primary
                    : componentColors.button.border.default
                }
                size="sm"
                onClick={() => handleTripTypeToggle(type)}
              >
                {type}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
}
