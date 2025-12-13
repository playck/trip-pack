import { useState, useEffect, useCallback } from "react";

/**
 * 키보드가 올라올 때 visualViewport 높이 변화를 감지해서
 * 바텀시트를 키보드 위로 올려주는 훅
 */
export function useKeyboardOffset(isOpen: boolean) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const handleViewportResize = useCallback(() => {
    if (!window.visualViewport) return;

    // 전체 viewport 높이와 visual viewport 높이의 차이 = 키보드 높이
    const offsetHeight = window.innerHeight - window.visualViewport.height;

    // 키보드가 올라왔을 때만 offset 적용 (최소 100px 이상일 때)
    if (offsetHeight > 100) {
      setKeyboardOffset(offsetHeight);
    } else {
      setKeyboardOffset(0);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !window.visualViewport) return;

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportResize
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportResize
      );
      setKeyboardOffset(0);
    };
  }, [isOpen, handleViewportResize]);

  return keyboardOffset;
}
