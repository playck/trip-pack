import { useDisclosure } from "@chakra-ui/react";

export function usePackingSheets() {
  const {
    open: isCategoryOpen,
    onOpen: onCategoryOpen,
    onClose: onCategoryClose,
  } = useDisclosure();
  const {
    open: isTemplateOpen,
    onOpen: onTemplateOpen,
    onClose: onTemplateClose,
  } = useDisclosure();
  const {
    open: isShareOpen,
    onOpen: onShareOpen,
    onClose: onShareClose,
  } = useDisclosure();
  const {
    open: isSaveOpen,
    onOpen: onSaveOpen,
    onClose: onSaveClose,
  } = useDisclosure();
  const {
    open: isBaggageOpen,
    onOpen: onBaggageOpen,
    onClose: onBaggageClose,
  } = useDisclosure();

  return {
    category: { isOpen: isCategoryOpen, onOpen: onCategoryOpen, onClose: onCategoryClose },
    template: { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose },
    share: { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose },
    save: { isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose },
    baggage: { isOpen: isBaggageOpen, onOpen: onBaggageOpen, onClose: onBaggageClose },
  };
}
