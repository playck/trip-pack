import { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Box, Input } from "@chakra-ui/react";
import { Search } from "lucide-react";

interface PlaceSearchInputProps {
  onSearchChange: (debouncedQuery: string) => void;
}

export default function PlaceSearchInput({
  onSearchChange,
}: PlaceSearchInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounceValue(inputValue, 350);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
  };

  return (
    <Box py={2} position="relative">
      <Input
        placeholder="장소를 검색하세요"
        value={inputValue}
        onChange={handleChange}
        size="lg"
        pl={10}
        autoFocus
      />
      <Box
        position="absolute"
        left={3}
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
      >
        <Search size={20} color="gray" />
      </Box>
    </Box>
  );
}
