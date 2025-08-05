import { Outlet, createRootRoute } from "@tanstack/react-router";

import Header from "../shared/components/layout/Header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
      }}
    >
      <Header />
      <Outlet />
    </div>
  );
}
