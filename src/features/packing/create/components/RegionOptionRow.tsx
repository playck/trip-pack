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
      <Box>
        <Text fontWeight="medium">{item.region.name}</Text>
        <Text color="fg.muted" fontSize="sm">
          {item.region.englishName ?? item.region.id} · {item.region.country}
        </Text>
      </Box>
      <Combobox.ItemIndicator />
    </Box>
  );
}
