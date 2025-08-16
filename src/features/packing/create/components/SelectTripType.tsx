import { Button, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { componentColors } from "@/shared/constants/colors";
import { type TripTypeOption, TRIP_TYPE_OPTIONS } from "../data/data";
import { packingCreateAtom } from "../store/packingCreateAtom";

export default function SelectTripType() {
  const [packingState, setPackingState] = useAtom(packingCreateAtom);
  const { tripTypes } = packingState;

  const handleTripTypeToggle = (type: TripTypeOption) => {
    if (tripTypes.includes(type)) {
      setPackingState((prev) => ({
        ...prev,
        tripTypes: tripTypes.filter((t) => t !== type),
      }));
    } else {
      setPackingState((prev) => ({
        ...prev,
        tripTypes: [...tripTypes, type],
      }));
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <Wrap gap={3}>
        {TRIP_TYPE_OPTIONS.map((type) => (
          <WrapItem key={type}>
            <Button
              variant={tripTypes.includes(type) ? "solid" : "outline"}
              colorPalette={componentColors.button.primary}
              borderColor={
                tripTypes.includes(type)
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
