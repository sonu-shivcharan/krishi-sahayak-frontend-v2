
import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatProvider, useSharedChat } from "@/hooks/useSharedChat";

export const Route = createFileRoute("/_chat-layout")({
  component: ChatLayout,
});

function ChatLayout() {
  return (
    <ChatProvider>
      <ChatLayoutInner />
    </ChatProvider>
  );
}

function ChatLayoutInner() {
  const { allSessions, isLoadingConversations } = useSharedChat();
  const params = useParams({ strict: false });
  const currentChatId = params.chatId || null;

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          chatSessions={allSessions}
          currentChatId={currentChatId}
          isLoading={isLoadingConversations}
        />
      </div>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}
