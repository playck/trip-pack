import { useState, useMemo } from "react";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MAP_ZOOM,
} from "../constants";
import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * 일정 지도 상태 관리 훅
 * - 지도 접기/펼치기, 전체화면
 * - 포커스 위치, 마커 생성
 */
export function useScheduleMap(
  allSchedules: Schedule[] | undefined,
  regionCoordinates: Coordinates | null
) {
  const [focusedLocation, setFocusedLocation] = useState<Coordinates | null>(
    null
  );
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  const mapCenter = focusedLocation || regionCoordinates || DEFAULT_MAP_CENTER;
  const mapZoom = focusedLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM;

  const scheduleMarkers = useMemo(() => {
    if (!allSchedules || allSchedules.length === 0) return [];

    return allSchedules
      .filter((s) => !isMemo(s))
      .filter((s) => s.latitude != null && s.longitude != null)
      .sort((a, b) => a.visit_order - b.visit_order)
      .map((schedule, index) => ({
        id: schedule.id,
        position: {
          lat: schedule.latitude!,
          lng: schedule.longitude!,
        },
        title: schedule.place_name,
        label: index + 1,
      }));
  }, [allSchedules]);

  const handleScheduleClick = (schedule: Schedule) => {
    if (!schedule.latitude || !schedule.longitude) return;
    setFocusedLocation({
      lat: schedule.latitude,
      lng: schedule.longitude,
    });
  };

  const handleToggleCollapse = () => {
    setIsMapCollapsed((prev) => !prev);
  };

  return {
    focusedLocation,
    isMapFullScreen,
    isMapCollapsed,
    mapCenter,
    mapZoom,
    scheduleMarkers,
    setIsMapFullScreen,
    handleScheduleClick,
    handleToggleCollapse,
  };
}
