interface TripNotificationMessage {
  type: "TRIP_NOTIFICATION";
  action: "schedule" | "cancel";
  tripId: string;
  tripTitle?: string;
  startDate?: string;
}

interface HapticMessage {
  type: "HAPTIC";
  style: "light" | "medium" | "heavy" | "success" | "warning" | "error";
}

interface OpenUrlMessage {
  type: "OPEN_URL";
  url: string;
}

type NativeMessage = TripNotificationMessage | HapticMessage | OpenUrlMessage;

interface ScheduleData {
  tripId: string;
  tripTitle: string;
  startDate: string;
}

interface CancelData {
  tripId: string;
}

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

function postNativeMessage(message: NativeMessage) {
  if (!window.ReactNativeWebView) return;
  window.ReactNativeWebView.postMessage(JSON.stringify(message));
}

export function scheduleTripNotification(data: ScheduleData) {
  postNativeMessage({
    type: "TRIP_NOTIFICATION",
    action: "schedule",
    ...data,
  });
}

export function cancelTripNotification(data: CancelData) {
  postNativeMessage({
    type: "TRIP_NOTIFICATION",
    action: "cancel",
    ...data,
  });
}

export function triggerHaptic(
  style: HapticMessage["style"] = "light"
) {
  postNativeMessage({ type: "HAPTIC", style });
}

export function openUrl(url: string) {
  postNativeMessage({ type: "OPEN_URL", url });
}
