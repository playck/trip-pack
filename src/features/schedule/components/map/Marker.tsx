import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface Location {
  lat: number;
  lng: number;
}

interface MarkerProps {
  position: Location;
  label: string | number;
  color?: string;
  title?: string;
  onClick?: () => void;
}

export default function Marker({
  position,
  label,
  color = "#3B82F6",
  title,
  onClick,
}: MarkerProps) {
  return (
    <AdvancedMarker position={position} title={title} onClick={onClick}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: color,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "16px",
          border: "3px solid white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      >
        {label}
      </div>
    </AdvancedMarker>
  );
}
