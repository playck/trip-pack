import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box px={3} w="full">
      {children}
    </Box>
  );
}
