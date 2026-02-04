import { Box, Text } from "@chakra-ui/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { colors } from "@/shared/constants/colors";

interface MapCollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function MapCollapseButton({
  isCollapsed,
  onToggle,
}: MapCollapseButtonProps) {
  return (
    <Box position="relative" zIndex={20}>
      <Box display="flex" justifyContent="center" w="full" mt="2px">
        <Box
          as="button"
          bg="white"
          w="full"
          py={1}
          boxShadow="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={1}
          position="relative"
          zIndex={20}
          cursor="pointer"
          _active={{ bg: "gray.50" }}
          onClick={onToggle}
        >
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            {isCollapsed ? "지도 보기" : "지도 숨기기"}
          </Text>
          {isCollapsed ? (
            <ChevronDown size={14} color={colors.neutral.hex[500]} />
          ) : (
            <ChevronUp size={14} color={colors.neutral.hex[500]} />
          )}
        </Box>
      </Box>
      {/* 가림막 엘리먼트 */}
      <Box
        className="map-curtain-el"
        position="absolute"
        top="100%"
        left={0}
        right={0}
        height="8px"
        bg="white"
      />
    </Box>
  );
}
