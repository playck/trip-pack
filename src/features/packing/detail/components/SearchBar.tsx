import { Box } from "@chakra-ui/react";
import ItemSearch from "./ItemSearch";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Box
      bg="white"
      borderBottom="1px"
      borderColor="gray.100"
      pt={2}
      position="sticky"
      top="96px"
      zIndex={99}
    >
      <ItemSearch onSearch={onSearch} />
    </Box>
  );
}
