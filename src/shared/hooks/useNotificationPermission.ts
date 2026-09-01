import { useEffect, useState } from "react";
import { queryNotificationPermission } from "@/shared/utils/nativeMessage";

export type NotificationPermissionState = "unknown" | "granted" | "denied";

const PERMISSION_EVENT = "notification-permission-result";

/**
 * 기기 알림 권한 상태. enabled 동안 RN에 상태를 요청하고 응답 이벤트를 구독한다.
 * 구버전 앱(프로토콜 미지원)은 응답이 없어 "unknown"에 머문다 —
 * 소비자는 "denied"일 때만 경고 UI를 보여야 한다.
 */
export function useNotificationPermission(
  enabled: boolean = true
): NotificationPermissionState {
  const [permission, setPermission] =
    useState<NotificationPermissionState>("unknown");

  useEffect(() => {
    if (!enabled) return;

    const handleResult = (event: Event) => {
      const detail = (event as CustomEvent<{ granted?: boolean }>).detail;
      if (typeof detail?.granted !== "boolean") return;
      setPermission(detail.granted ? "granted" : "denied");
    };

    window.addEventListener(PERMISSION_EVENT, handleResult);
    queryNotificationPermission();
    return () => window.removeEventListener(PERMISSION_EVENT, handleResult);
  }, [enabled]);

  return permission;
}
