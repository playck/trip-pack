import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

export default function PageLayout({ children, style }: PageLayoutProps) {
  return (
    <Box px={3} w="full" style={style}>
      {children}
    </Box>
  );
}
