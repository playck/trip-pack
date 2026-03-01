interface TripNotificationMessage {
  type: "TRIP_NOTIFICATION";
  action: "schedule" | "cancel";
  tripId: string;
  tripTitle?: string;
  startDate?: string;
}

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

function postNativeMessage(message: TripNotificationMessage) {
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
