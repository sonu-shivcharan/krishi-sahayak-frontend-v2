import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MainPage,
});
function MainPage() {
  return <div>MainPage</div>;
}

export default MainPage;
