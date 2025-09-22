import { useState } from "react";
import { Input, HStack, IconButton } from "@chakra-ui/react";
import { Search, X } from "lucide-react";

interface ItemSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function ItemSearch({
  onSearch,
  placeholder = "아이템 검색",
}: ItemSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <HStack gap={2} w="full">
      <HStack
        flex={1}
        bg="gray.50"
        borderRadius="md"
        px={3}
        py={1.5}
        border="1px solid"
        borderColor="gray.200"
        outline="none"
        _focusWithin={{
          bg: "white",
          borderColor: "gray.300",
        }}
        transition="all 0.2s"
      >
        <Search size={16} color="#9CA3AF" />
        <Input
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          border="none"
          outline="none"
          p={0}
          fontSize="sm"
          h="auto"
          minH="auto"
          _focus={{ boxShadow: "none", outline: "none" }}
          _focusVisible={{ boxShadow: "none", outline: "none" }}
          _placeholder={{ color: "gray.400" }}
        />
        {searchQuery && (
          <IconButton
            aria-label="검색어 지우기"
            size="xs"
            variant="ghost"
            color="gray.400"
            onClick={handleClear}
            minW="auto"
            h="auto"
            p={1}
          >
            <X size={14} />
          </IconButton>
        )}
      </HStack>
    </HStack>
  );
}
