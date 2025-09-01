import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../features/main/mainPage";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MainPage />;
}
