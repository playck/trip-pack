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
      staleTime: 0,
      gcTime: 1000 * 60 * 60 * 24, // 24시간 (persist 데이터가 GC로 사라지지 않도록)
      refetchOnWindowFocus: false,
      retry: (failureCount) => {
        if (!navigator.onLine) return false;
        return failureCount < 3;
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
