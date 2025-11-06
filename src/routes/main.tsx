import { createFileRoute } from "@tanstack/react-router";
import MainPage from "../features/main/mainPage";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MainPage />;
}
