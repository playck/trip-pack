import { Button, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { componentColors } from "@/shared/constants/colors";
import { type TripTypeOption, TRIP_TYPE_OPTIONS } from "../data/data";

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
    <VStack gap={4} align="stretch">
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
  );
}
