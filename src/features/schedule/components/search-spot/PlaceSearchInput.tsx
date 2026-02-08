import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  // autoFocus 대신 딜레이 포커스 (모바일 브라우저 네이티브 스크롤 방지)
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
  };

  return (
    <Box py={2} position="relative">
      <Input
        ref={inputRef}
        placeholder="장소를 검색하세요"
        value={inputValue}
        onChange={handleChange}
        size="lg"
        pl={10}
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
