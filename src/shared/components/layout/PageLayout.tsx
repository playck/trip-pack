import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box px={4} w="full">
      {children}
    </Box>
  );
}
