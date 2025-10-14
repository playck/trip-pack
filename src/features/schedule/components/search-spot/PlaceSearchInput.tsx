import { Box, Input } from "@chakra-ui/react";
import { Search } from "lucide-react";

interface PlaceSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PlaceSearchInput({
  value,
  onChange,
}: PlaceSearchInputProps) {
  return (
    <Box py={4} position="relative">
      <Input
        placeholder="장소를 검색하세요"
        value={value}
        onChange={onChange}
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
