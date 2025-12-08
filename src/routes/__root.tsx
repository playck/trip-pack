import { Outlet, createRootRoute } from "@tanstack/react-router";

import Header from "../shared/components/layout/Header";
import LoadingSpinner from "../shared/components/LoadingSpinner";

export const Route = createRootRoute({
  component: RootComponent,
  pendingComponent: () => <LoadingSpinner fullScreen centered />,
});

function RootComponent() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
}
