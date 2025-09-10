import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeft, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  return (
    <Box
      as="header"
      w="full"
      h="56px"
      bg="bg.panel"
      borderBottomWidth="1px"
      borderColor="border.subtle"
      position="sticky"
      top="0"
      zIndex="sticky"
      px={4}
    >
      <Flex
        align="center"
        justify="space-between"
        h="full"
        maxW="container.xl"
        mx="auto"
      >
        <Flex align="center" minW="40px">
          {showBackButton && (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="뒤로가기"
              onClick={onBackClick}
            >
              <ChevronLeft size="20" />
            </IconButton>
          )}
        </Flex>

        <Link to="/">
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="fg.emphasized"
            textAlign="center"
            lineHeight="1"
            truncate
          >
            Trip Pack
          </Text>
        </Link>

        <Flex align="center" minW="40px" justify="flex-end">
          <Menu size="20" />
        </Flex>
      </Flex>
    </Box>
  );
}
