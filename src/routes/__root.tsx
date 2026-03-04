import { Outlet, createRootRoute } from "@tanstack/react-router";

import Header from "../shared/components/layout/Header";
import OfflineBanner from "../shared/components/OfflineBanner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <OfflineBanner />
      <Header />
      <Outlet />
    </div>
  );
}
