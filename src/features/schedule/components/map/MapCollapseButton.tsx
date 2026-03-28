import { Box, HStack, Text } from "@chakra-ui/react";
import { ChevronUp, ChevronDown, EyeOff, Eye } from "lucide-react";
import { colors } from "@/shared/constants/colors";

interface MapCollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  hidePast?: boolean;
  onToggleHidePast?: () => void;
}

export default function MapCollapseButton({
  isCollapsed,
  onToggle,
  hidePast,
  onToggleHidePast,
}: MapCollapseButtonProps) {
  return (
    <Box position="relative" zIndex={20}>
      <Box display="flex" justifyContent="center" w="full" mt="2px">
        <HStack
          bg="white"
          w="full"
          py={1}
          boxShadow="sm"
          position="relative"
          zIndex={20}
          gap={0}
        >
          {/* 지도 숨기기 버튼 */}
          <Box
            as="button"
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
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

          {/* 지난 일정 숨기기 버튼 */}
          {onToggleHidePast && (
            <>
              <Box w="1px" h="12px" bg="gray.200" />
              <Box
                as="button"
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1}
                cursor="pointer"
                _active={{ bg: "gray.50" }}
                onClick={onToggleHidePast}
              >
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  {hidePast ? "지난 일정 보기" : "지난 일정 숨기기"}
                </Text>
                {hidePast ? (
                  <Eye size={14} color={colors.neutral.hex[500]} />
                ) : (
                  <EyeOff size={14} color={colors.neutral.hex[500]} />
                )}
              </Box>
            </>
          )}
        </HStack>
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
