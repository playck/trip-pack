import { useState } from "react";
import { onlineManager } from "@tanstack/react-query";
import { toaster } from "@/shared/components/ui/toaster";

/**
 * 입력 시트의 저장 버튼용: 서버 저장이 끝난 뒤에만 닫는다.
 * - 실패하면 입력을 그대로 둔다 (실패 토스트는 각 mutation의 onError 담당)
 * - 오프라인이면 보내지 않는다 — 대기 요청이 화면에 안 보여 중복 입력·앱 종료 시 유실을 부른다
 */
export function useSaveAndClose(onClose: () => void) {
  const [isSaving, setIsSaving] = useState(false);

  const saveAndClose = async (save: () => Promise<unknown>) => {
    if (isSaving) return;

    if (!onlineManager.isOnline()) {
      toaster.create({
        title: "오프라인이라 저장하지 못했어요",
        description: "입력한 내용은 그대로 있어요. 연결되면 다시 저장해 주세요.",
        type: "warning",
      });
      return;
    }

    setIsSaving(true);
    try {
      await save();
      onClose();
    } catch {
      // 입력 유지 — 실패 안내는 mutation onError 토스트가 한다
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveAndClose };
}
