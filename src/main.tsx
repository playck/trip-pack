import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { Provider as ChakraProvider } from "./shared/components/ui/provider";
import LoadingSpinner from "./shared/components/LoadingSpinner";
import GlobalErrorFallback from "./shared/components/GlobalErrorFallback";
import { initSentryAuthBridge } from "./shared/service/sentry";

import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <LoadingSpinner fullScreen centered />,
  defaultErrorComponent: (props) => <GlobalErrorFallback {...props} />,
  scrollRestoration: true,
});

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (import.meta.env.PROD && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.tanstackRouterBrowserTracingIntegration(router),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    sendDefaultPii: false,
    tracePropagationTargets: [
      /^\//,
      /^https:\/\/[^/]*\.supabase\.co\//,
    ],
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Failed to fetch",
      "Load failed",
      /Loading chunk \d+ failed/,
      /^Network Error/,
      "NetworkError when attempting to fetch resource",
      "The operation was aborted",
    ],
    beforeSend(event) {
      const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
      if (
        frames.some((f) =>
          /^(chrome|moz)-extension:\/\//.test(f.filename ?? "")
        )
      ) {
        return null;
      }
      return event;
    },
  });
  initSentryAuthBridge();
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.StrictMode>
  );
}
