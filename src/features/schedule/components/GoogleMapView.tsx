import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import Marker from "./Marker";
import RouteLine from "./RouteLine";

interface Location {
  lat: number;
  lng: number;
}

interface GoogleMapViewProps {
  center?: Location;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: Location;
    title?: string;
    label?: string | number;
  }>;
  height?: string;
  onMarkerClick?: (markerId: string) => void;
  showRoute?: boolean;
}

export default function GoogleMapView({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 12,
  markers = [],
  height = "200px",
  onMarkerClick,
  showRoute = true,
}: GoogleMapViewProps) {
  const map = useMap("schedule-map");
  const routePath = markers?.map((marker) => marker.position);
  const isHasRoutePath = showRoute && routePath.length > 1;

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
    <Box h={height} w="full" borderRadius="lg" overflow="hidden">
      <Map
        id="schedule-map"
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={true}
        fullscreenControl={true}
        clickableIcons={false}
        mapId="schedule-map"
      >
        {isHasRoutePath && <RouteLine path={routePath} />}

        {markers.map((marker) =>
          marker.label ? (
            <Marker
              key={marker.id}
              position={marker.position}
              label={marker.label}
              title={marker.title}
              onClick={() => onMarkerClick?.(marker.id)}
            />
          ) : null
        )}
      </Map>
    </Box>
  );
}
