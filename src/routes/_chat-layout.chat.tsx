import { Chat } from "@/components/chats/chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_chat-layout/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chat />;
}
