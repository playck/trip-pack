import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface RouteLineProps {
  path: Location[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export default function RouteLine({
  path,
  strokeColor = "#3B82F6",
  strokeWeight = 3,
  strokeOpacity = 0.8,
}: RouteLineProps) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map || !geometryLibrary || path.length < 2) return;

    if (polyline) {
      polyline.setMap(null);
    }

    const newPolyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: strokeWeight,
      map: map,
    });

    setPolyline(newPolyline);

    return () => {
      if (newPolyline) {
        newPolyline.setMap(null);
      }
    };
  }, [map, geometryLibrary, path, strokeColor, strokeWeight, strokeOpacity]);

  return null;
}
