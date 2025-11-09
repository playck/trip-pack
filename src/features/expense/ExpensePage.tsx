import { Box, Heading } from "@chakra-ui/react";
import PageLayout from "@/shared/components/layout/PageLayout";

export default function ExpensePage() {
  return (
    <PageLayout>
      <Box p={4}>
        <Heading size="lg" mb={4}>
          경비 관리
        </Heading>
      </Box>
    </PageLayout>
  );
}
