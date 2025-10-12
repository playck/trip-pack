import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface Location {
  lat: number;
  lng: number;
}

interface MarkerProps {
  position: Location;
  label: string | number;
  title?: string;
  onClick?: () => void;
}

export default function Marker({
  position,
  label,
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
          backgroundColor: "#3B82F6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "16px",
          border: "3px solid white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        }}
      >
        {label}
      </div>
    </AdvancedMarker>
  );
}
