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
  const {
    open: isInviteOpen,
    onOpen: onInviteOpen,
    onClose: onInviteClose,
  } = useDisclosure();
  const {
    open: isMembersOpen,
    onOpen: onMembersOpen,
    onClose: onMembersClose,
  } = useDisclosure();
  const {
    open: isShoppingCategoryOpen,
    onOpen: onShoppingCategoryOpen,
    onClose: onShoppingCategoryClose,
  } = useDisclosure();

  return {
    category: { isOpen: isCategoryOpen, onOpen: onCategoryOpen, onClose: onCategoryClose },
    shoppingCategory: { isOpen: isShoppingCategoryOpen, onOpen: onShoppingCategoryOpen, onClose: onShoppingCategoryClose },
    template: { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose },
    share: { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose },
    save: { isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose },
    baggage: { isOpen: isBaggageOpen, onOpen: onBaggageOpen, onClose: onBaggageClose },
    invite: { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose },
    members: { isOpen: isMembersOpen, onOpen: onMembersOpen, onClose: onMembersClose },
  };
}
