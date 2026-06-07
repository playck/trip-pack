"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { isTripWithinPersistWindow } from "@/shared/utils/persistFilter";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { Toaster } from "./toaster";

onlineManager.setEventListener((setOnline) => {
  const handleOnline = () => setOnline(true);
  const handleOffline = () => setOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시를 5분간 "신선"으로 간주 → 화면 재진입/네비게이션마다 발생하던 불필요한 refetch 제거.
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 60 * 24, // 24시간 (persist 데이터가 GC로 사라지지 않도록)
      refetchOnWindowFocus: false, // 웹뷰 포커스 노이즈 방지
      refetchOnReconnect: true, // 재연결 시 stale 데이터 자동 갱신
      retry: (failureCount) => {
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
    },
    dehydrate: {
      shouldDehydrateQuery: (query): boolean => {
        if (query.meta?.persist !== true || query.state.status !== "success") {
          return false;
        }
        return isTripWithinPersistWindow(query, queryClient);
      },
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "TRIP_PACK_QUERY_OFFLINE_CACHE",
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
        <Toaster />
      </ChakraProvider>
    </PersistQueryClientProvider>
  );
}
