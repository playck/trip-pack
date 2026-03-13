import { Badge } from "@chakra-ui/react";
import { REMARK_COLORS } from "../types";

interface FlightStatusBadgeProps {
  remark: string;
}

export default function FlightStatusBadge({ remark }: FlightStatusBadgeProps) {
  const displayText = remark || "정보없음";
  const colors = REMARK_COLORS[remark] || { bg: "#F7FAFC", text: "#718096" };

  return (
    <Badge
      px={2.5}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="bold"
      bg={colors.bg}
      color={colors.text}
    >
      {displayText}
    </Badge>
  );
}
