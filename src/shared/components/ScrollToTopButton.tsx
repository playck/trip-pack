import { IconButton } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  onClick: () => void;
  floating?: boolean;
}

export default function ScrollToTopButton({
  onClick,
  floating,
}: ScrollToTopButtonProps) {
  return (
    <IconButton
      aria-label="맨 위로 스크롤"
      onClick={onClick}
      rounded="full"
      size="lg"
      bg="white"
      color="gray.600"
      shadow="lg"
      borderWidth="1px"
      borderColor="gray.200"
      {...(floating && {
        position: "fixed" as const,
        bottom: 6,
        right: 6,
        zIndex: 999,
      })}
    >
      <ArrowUp size={20} />
    </IconButton>
  );
}
