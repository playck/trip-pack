import {
  VStack,
  Button,
  HStack,
  Text,
  StackSeparator,
  IconButton,
} from "@chakra-ui/react";
import { Copy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";
import BottomSheet from "@/shared/components/BottomSheet";
import { toaster } from "@/shared/components/ui/toaster";
import { borderColors, statusColors } from "@/shared/constants/colors";

export interface PlaceAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isDangerous?: boolean;
}

interface PlaceActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  placeName: string;
  placeAddress?: string;
  actions: PlaceAction[];
}

export default function PlaceActionSheet({
  isOpen,
  onClose,
  placeName,
  placeAddress,
  actions,
}: PlaceActionSheetProps) {
  const [, copy] = useCopyToClipboard();

  const handleCopyAddress = async () => {
    if (!placeAddress) return;
    try {
      await copy(placeAddress);
      toaster.create({
        description: "주소를 복사했어요.",
        type: "success",
        duration: 1200,
      });
    } catch {
      toaster.create({
        description: "복사에 실패했어요. 다시 시도해주세요.",
        type: "error",
        duration: 1500,
      });
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={placeName}>
      <VStack p={3} pt={0} align="stretch" gap={0}>
        {placeAddress && (
          <HStack px="4px" justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600" flex="1">
              {placeAddress}
            </Text>
            <IconButton
              aria-label="주소 복사"
              variant="ghost"
              size="xs"
              flexShrink={0}
              onClick={handleCopyAddress}
            >
              <Copy size={12} />
            </IconButton>
          </HStack>
        )}
        <VStack
          gap={0}
          align="stretch"
          separator={<StackSeparator borderColor={borderColors.default} />}
        >
          {actions.map(({ icon: Icon, label, onClick, isDangerous }) => (
            <Button
              key={label}
              variant="ghost"
              size="lg"
              justifyContent="flex-start"
              color={isDangerous ? statusColors.error.text : "gray.700"}
              fontWeight="medium"
              h="56px"
              px={2}
              onClick={() => {
                onClick();
                onClose();
              }}
            >
              <HStack gap={3}>
                <Icon size={20} />
                <Text>{label}</Text>
              </HStack>
            </Button>
          ))}
        </VStack>
      </VStack>
    </BottomSheet>
  );
}
