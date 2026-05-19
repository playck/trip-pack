import { useState, useMemo } from "react";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  FOCUSED_MAP_ZOOM,
  getDayColor,
} from "../constants";
import { isMemo } from "../utils/scheduleHelpers";
import type { Schedule } from "../types";

interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapMarkerData {
  id: string;
  position: Coordinates;
  title: string;
  label: number;
  dayNumber: number;
  color: string;
}

export interface DayRouteData {
  dayNumber: number;
  color: string;
  path: Coordinates[];
}

/**
 * 일정 지도 상태 관리 훅
 * - 지도 접기/펼치기, 전체화면
 * - 포커스 위치, 일차별 색상 마커 / 일차별 라우트
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const mapCenter = focusedLocation || regionCoordinates || DEFAULT_MAP_CENTER;
  const mapZoom = focusedLocation ? FOCUSED_MAP_ZOOM : DEFAULT_MAP_ZOOM;

  const { allMarkers, allRoutes } = useMemo(() => {
    if (!allSchedules || allSchedules.length === 0) {
      return {
        allMarkers: [] as MapMarkerData[],
        allRoutes: [] as DayRouteData[],
      };
    }

    const sorted = allSchedules
      .filter((s) => !isMemo(s))
      .filter((s) => s.latitude != null && s.longitude != null)
      .sort((a, b) =>
        a.day_number !== b.day_number
          ? a.day_number - b.day_number
          : a.visit_order - b.visit_order
      );

    const grouped = new Map<number, Schedule[]>();
    for (const schedule of sorted) {
      const list = grouped.get(schedule.day_number) ?? [];
      list.push(schedule);
      grouped.set(schedule.day_number, list);
    }

    const markers: MapMarkerData[] = [];
    const routes: DayRouteData[] = [];

    for (const [dayNumber, daySchedules] of grouped) {
      const color = getDayColor(dayNumber);

      daySchedules.forEach((schedule, index) => {
        markers.push({
          id: schedule.id,
          position: {
            lat: schedule.latitude!,
            lng: schedule.longitude!,
          },
          title: schedule.place_name,
          label: index + 1,
          dayNumber,
          color,
        });
      });

      if (daySchedules.length > 1) {
        routes.push({
          dayNumber,
          color,
          path: daySchedules.map((s) => ({
            lat: s.latitude!,
            lng: s.longitude!,
          })),
        });
      }
    }

    return { allMarkers: markers, allRoutes: routes };
  }, [allSchedules]);

  const availableDays = useMemo(() => {
    const days = new Set(allMarkers.map((m) => m.dayNumber));
    return Array.from(days).sort((a, b) => a - b);
  }, [allMarkers]);

  const dayColorMap = useMemo(() => {
    const map = new Map<number, string>();
    for (const day of availableDays) {
      map.set(day, getDayColor(day));
    }
    return map;
  }, [availableDays]);

  const { scheduleMarkers, routesByDay } = useMemo(() => {
    if (selectedDay === null) {
      return { scheduleMarkers: allMarkers, routesByDay: allRoutes };
    }
    return {
      scheduleMarkers: allMarkers.filter((m) => m.dayNumber === selectedDay),
      routesByDay: allRoutes.filter((r) => r.dayNumber === selectedDay),
    };
  }, [allMarkers, allRoutes, selectedDay]);

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
    routesByDay,
    availableDays,
    selectedDay,
    setSelectedDay,
    dayColorMap,
    setIsMapFullScreen,
    handleScheduleClick,
    handleToggleCollapse,
  };
}
