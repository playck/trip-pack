import { Box } from "@chakra-ui/react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
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
  height = "300px",
  onMarkerClick,
  showRoute = true,
}: GoogleMapViewProps) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const routePath = markers.map((marker) => marker.position);

  if (!googleMapsApiKey) {
    return (
      <Box
        h={height}
        w="full"
        bg="gray.100"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="gray.600"
      >
        Google Maps API가 설정되지 않았습니다.
      </Box>
    );
  }

  return (
    <Box h={height} w="full" borderRadius="lg" overflow="hidden">
      <APIProvider apiKey={googleMapsApiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="schedule-map"
        >
          {/* 경로선 */}
          {showRoute && routePath.length > 1 && <RouteLine path={routePath} />}

          {/* 마커들 */}
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
      </APIProvider>
    </Box>
  );
}
