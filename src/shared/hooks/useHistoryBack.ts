import { useEffect, useRef } from "react";

/**
 * 오버레이(사이드 패널, 바텀시트 등)가 열릴 때 히스토리 엔트리를 추가하여
 * 브라우저 뒤로가기로 닫을 수 있게 하는 훅.
 */
export function useHistoryBack(isOpen: boolean, onClose: () => void) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      history.pushState({ overlay: true }, "");
      pushedRef.current = true;

      const handlePopState = () => {
        pushedRef.current = false;
        onClose();
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        // 프로그래밍 방식 닫힘 (X 버튼, 백드롭) → 추가했던 엔트리 제거
        if (pushedRef.current) {
          pushedRef.current = false;
          history.back();
        }
      };
    }
  }, [isOpen, onClose]);
}
