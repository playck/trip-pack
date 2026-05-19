import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { Maximize2, Minimize2 } from "lucide-react";
import Marker from "./Marker";
import RouteLine from "./RouteLine";

interface Location {
  lat: number;
  lng: number;
}

type MapMarker = {
  id: string;
  position: Location;
  title?: string;
  label?: string | number;
  color?: string;
};

type DayRoute = {
  dayNumber: number;
  color: string;
  path: Location[];
};

interface GoogleMapViewProps {
  center?: Location;
  zoom?: number;
  markers?: MapMarker[];
  routes?: DayRoute[];
  height?: string;
  showRoute?: boolean;
  onMarkerClick?: (markerId: string) => void;
  onFullScreenChange?: (isFullScreen: boolean) => void;
}

const DEFAULT_CENTER: Location = { lat: 37.5665, lng: 126.978 };
const DEFAULT_MARKERS: MapMarker[] = [];
const DEFAULT_ROUTES: DayRoute[] = [];

export default function GoogleMapView({
  center = DEFAULT_CENTER,
  zoom = 12,
  markers = DEFAULT_MARKERS,
  routes = DEFAULT_ROUTES,
  height = "200px",
  showRoute = true,
  onMarkerClick,
  onFullScreenChange,
}: GoogleMapViewProps) {
  const map = useMap("schedule-map");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    onFullScreenChange?.(!isFullScreen);
  };

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  return (
    <Box
      h={isFullScreen ? "100vh" : height}
      w={isFullScreen ? "100vw" : "full"}
      position={isFullScreen ? "fixed" : "relative"}
      top={isFullScreen ? 0 : "auto"}
      left={isFullScreen ? 0 : "auto"}
      zIndex={isFullScreen ? 99999 : "auto"}
      borderRadius={isFullScreen ? 0 : "lg"}
      overflow="hidden"
      style={{ touchAction: "none" }}
    >
      <Map
        id="schedule-map"
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={true}
        fullscreenControl={false}
        zoomControl={false}
        clickableIcons={false}
        mapId="schedule-map"
      >
        {showRoute &&
          routes.map((route) =>
            route.path.length > 1 ? (
              <RouteLine
                key={route.dayNumber}
                path={route.path}
                strokeColor={route.color}
              />
            ) : null
          )}

        {markers.map((marker) =>
          marker.label ? (
            <Marker
              key={marker.id}
              position={marker.position}
              label={marker.label}
              color={marker.color}
              title={marker.title}
              onClick={() => onMarkerClick?.(marker.id)}
            />
          ) : null
        )}
      </Map>

      {/* 전체화면 버튼 */}
      <Box
        as="button"
        aria-label="전체화면 전환"
        position="absolute"
        bottom={isFullScreen ? 8 : 3}
        right={3}
        zIndex={10}
        bg="white"
        boxShadow="md"
        width="30px"
        height="30px"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? (
          <Minimize2 size={16} color="#4A5568" />
        ) : (
          <Maximize2 size={16} color="#4A5568" />
        )}
      </Box>
    </Box>
  );
}
