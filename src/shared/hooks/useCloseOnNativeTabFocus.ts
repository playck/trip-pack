import { useEffect } from "react";

const TAB_FOCUS_EVENT = "native:tab-focus";

/**
 * 네이티브 앱에서 탭을 전환했다가 돌아왔을 때 열려 있던 시트/모달을 닫는다.
 *
 * 네이티브는 탭 재진입 시 웹뷰에 native:tab-focus 이벤트를 주입한다.
 * 웹에서만 열었을 때는 이 이벤트가 오지 않으므로 아무 영향이 없다.
 *
 * @param isOpen  현재 열려 있는지 (닫혀 있으면 구독하지 않음)
 * @param onClose 닫기 콜백
 * @param enabled false면 탭 전환에도 열린 상태를 유지한다
 */
export function useCloseOnNativeTabFocus(
  isOpen: boolean,
  onClose: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!isOpen || !enabled) return;

    const handleTabFocus = () => onClose();

    window.addEventListener(TAB_FOCUS_EVENT, handleTabFocus);
    return () => window.removeEventListener(TAB_FOCUS_EVENT, handleTabFocus);
  }, [isOpen, enabled, onClose]);
}
