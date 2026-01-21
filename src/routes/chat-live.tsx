import VoiceChat from "@/components/live";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat-live")({
  component: RouteComponent,
});

function RouteComponent() {
  return <VoiceChat />;
}
