import { Box } from "@chakra-ui/react";
import { GripVertical } from "lucide-react";

export default function DragHandle() {
  return (
    <Box cursor="grab" _active={{ cursor: "grabbing" }} py={1}>
      <GripVertical size={20} color="#A0AEC0" />
    </Box>
  );
}
