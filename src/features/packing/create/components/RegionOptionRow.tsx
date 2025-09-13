import { Box, Text } from "@chakra-ui/react";
import { Combobox } from "@chakra-ui/react";

import type { RegionItem } from "./SearchRegionComboBox";

export default function RegionOptionRow({ item }: { item: RegionItem }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={3}
      width="100%"
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Text fontSize="lg">{item.region.flag}</Text>
        <Text fontWeight="medium">
          {item.region.name} ·{" "}
          <Text as="span" color="fg.muted">
            {item.region.country}
          </Text>
        </Text>
      </Box>
      <Combobox.ItemIndicator />
    </Box>
  );
}
