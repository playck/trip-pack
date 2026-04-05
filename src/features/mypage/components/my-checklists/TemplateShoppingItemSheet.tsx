import { useState, useEffect } from "react";
import { BottomSheet } from "@/shared/components";
import { toaster } from "@/shared/components/ui/toaster";
import ShoppingItemForm from "@/features/shopping/detail/components/ShoppingItemForm";
import type { TemplateItem } from "@/features/packing/type";

interface TemplateShoppingItemSheetProps {
  isOpen: boolean;
  item?: TemplateItem;
  onSave: (name: string, notes?: string, extra?: { price?: number; quantity?: number }) => void;
  onClose: () => void;
}

export default function TemplateShoppingItemSheet({
  isOpen,
  item,
  onSave,
  onClose,
}: TemplateShoppingItemSheetProps) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(1);

  const isEditMode = !!item;

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || "");
      setNotes(item?.notes || "");
      setPrice(item?.price ?? undefined);
      setQuantity(item?.quantity ?? 1);
    }
  }, [isOpen, item?.name, item?.notes, item?.price, item?.quantity]);

  const handleSave = () => {
    if (!name.trim()) {
      toaster.create({
        title: "아이템 이름을 입력해주세요.",
        type: "error",
        duration: 2000,
      });
      return;
    }

    onSave(name.trim(), notes.trim() || undefined, { price, quantity });
  };

  const handleClose = () => {
    setName("");
    setNotes("");
    setPrice(undefined);
    setQuantity(1);
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "수정하기" : "쇼핑 아이템 추가"}
      primaryButton={{
        onClick: handleSave,
        disabled: !name.trim(),
      }}
      secondaryButton={{
        onClick: handleClose,
      }}
    >
      <ShoppingItemForm
        name={name}
        notes={notes}
        price={price}
        quantity={quantity}
        onNameChange={setName}
        onNotesChange={setNotes}
        onPriceChange={setPrice}
        onQuantityChange={setQuantity}
      />
    </BottomSheet>
  );
}
