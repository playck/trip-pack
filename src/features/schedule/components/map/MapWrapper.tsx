import { Box } from "@chakra-ui/react";
import {
  HEADER_HEIGHT,
  TRIP_INFO_HEADER_HEIGHT,
} from "@/shared/constants/layout";

interface MapWrapperProps {
  isFullScreen: boolean;
  children: React.ReactNode;
}

export default function MapWrapper({
  isFullScreen,
  children,
}: MapWrapperProps) {
  return (
    <Box
      position="sticky"
      top={isFullScreen ? 0 : `${HEADER_HEIGHT + TRIP_INFO_HEADER_HEIGHT}px`}
      zIndex={isFullScreen ? 99999 : 10}
      bg="white"
      w="full"
    >
      {children}
    </Box>
  );
}
