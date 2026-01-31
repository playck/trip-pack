import { Box, type BoxProps } from "@chakra-ui/react";
import ItemSearch from "./ItemSearch";

interface SearchBarProps extends BoxProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch, ...boxProps }: SearchBarProps) {
  return (
    <Box
      bg="white"
      borderBottom="1px"
      borderColor="gray.100"
      pt={2}
      position="sticky"
      top="96px"
      zIndex={99}
      {...boxProps}
    >
      <ItemSearch onSearch={onSearch} />
    </Box>
  );
}
