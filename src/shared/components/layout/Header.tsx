import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeft, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import { HEADER_HEIGHT } from "@/shared/constants/layout";
import { useAuth } from "@/shared/hooks/useAuth";

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isMainPage = pathname === "/" || pathname === "/main";

  return (
    <Box
      as="header"
      w="full"
      h={`${HEADER_HEIGHT}px`}
      bg="bg.panel"
      borderBottomWidth="1px"
      borderColor="border.muted"
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

        {user && !isMainPage ? (
          <Link to="/">
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color="fg.emphasized"
              textAlign="center"
              lineHeight="1"
              truncate
            >
              TRIP PACK
            </Text>
          </Link>
        ) : (
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="fg.emphasized"
            textAlign="center"
            lineHeight="1"
            truncate
          >
            TRIP PACK
          </Text>
        )}

        <Flex align="center" minW="40px" justify="flex-end">
          {user && (
            <Link to="/mypage">
              <IconButton variant="ghost" size="sm" aria-label="마이페이지">
                <User size="20" />
              </IconButton>
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
