import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../features/main/MainPage";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MainPage />;
}
