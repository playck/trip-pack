import { Box } from "@chakra-ui/react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

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
  }>;
  height?: string;
}

export default function GoogleMapView({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 12,
  markers = [],
  height = "300px",
}: GoogleMapViewProps) {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </Map>
      </APIProvider>
    </Box>
  );
}
