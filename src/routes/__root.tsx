import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
      }}
    >
      <Outlet />
    </div>
  );
}
