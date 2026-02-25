import { Box, Text } from "@chakra-ui/react";
import { colors } from "@/shared/constants/colors";

interface MemberAvatarProps {
  username: string | null;
  size?: number;
}

export default function MemberAvatar({
  username,
  size = 36,
}: MemberAvatarProps) {
  const initial = username?.charAt(0)?.toUpperCase() || "?";

  return (
    <Box
      w={`${size}px`}
      h={`${size}px`}
      borderRadius="full"
      bg={`${colors.primary.palette}.100`}
      color={`${colors.primary.palette}.700`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
    >
      <Text fontSize={size > 32 ? "md" : "sm"} fontWeight="bold">
        {initial}
      </Text>
    </Box>
  );
}
