import { Box } from "@chakra-ui/react";
import { Map } from "@vis.gl/react-google-maps";
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
  const routePath = markers?.map((marker) => marker.position);
  const isHasRoutePath = showRoute && routePath.length > 1;

  return (
    <Box h={height} w="full" borderRadius="lg" overflow="hidden">
      <Map
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
