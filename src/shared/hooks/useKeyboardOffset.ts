import { useState, useEffect, useCallback } from "react";

/**
 * 키보드가 올라올 때 visualViewport 변화를 감지해서
 * 바텀시트를 키보드 위로 올려주는 훅
 *
 * keyboardOffset: 시트를 translateY 로 올릴 px
 * visibleHeight: 키보드 위에 실제 보이는 영역 높이 px (키보드 없으면 0)
 */
export function useKeyboardOffset(isOpen: boolean) {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);

  const handleViewportResize = useCallback(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    // 전체 viewport 높이와 visual viewport 높이의 차이 = 키보드 높이
    const keyboardHeight = window.innerHeight - vv.height;

    // 키보드가 올라왔을 때만 offset 적용 (최소 100px 이상일 때)
    if (keyboardHeight > 100) {
      // iOS 는 포커스된 input 을 보이게 하려고 visual viewport 를 위로 밀기도 한다(offsetTop).
      // 시트는 layout viewport 기준이므로 그만큼 덜 올려야 상단이 화면 밖으로 안 나간다.
      setKeyboardOffset(keyboardHeight - vv.offsetTop);
      setVisibleHeight(vv.height);
    } else {
      setKeyboardOffset(0);
      setVisibleHeight(0);
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
      setVisibleHeight(0);
    };
  }, [isOpen, handleViewportResize]);

  return { keyboardOffset, visibleHeight };
}
