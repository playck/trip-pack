import { Box } from "@chakra-ui/react";
import { AlertTriangle, Ban } from "lucide-react";

export type CabinPolicy = "allowed" | "restricted" | "prohibited";

interface CabinPolicyIconProps {
  policy: CabinPolicy | null | undefined;
  size?: number;
  onClick?: () => void;
}

export default function CabinPolicyIcon({
  policy,
  size = 14,
  onClick,
}: CabinPolicyIconProps) {
  const isAllowed = !policy || policy === "allowed";

  if (isAllowed) {
    return null;
  }

  const getIconConfig = () => {
    switch (policy) {
      case "restricted":
        return {
          icon: AlertTriangle,
          color: "orange.500",
        };
      case "prohibited":
        return {
          icon: Ban,
          color: "red.500",
        };
      default:
        return null;
    }
  };

  const config = getIconConfig();
  if (!config) return null;

  const { icon: IconComponent, color } = config;

  return (
    <Box
      as="button"
      display="inline-flex"
      alignItems="center"
      ml={1}
      color={color}
      cursor="pointer"
      borderRadius="sm"
      p={1}
      _active={{
        bg: "gray.200",
      }}
      onClick={onClick}
      aria-label="기내 수화물 정책 상세 정보"
    >
      <IconComponent size={size} />
    </Box>
  );
}
