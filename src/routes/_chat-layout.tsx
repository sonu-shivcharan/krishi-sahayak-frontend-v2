import { Outlet, createFileRoute, useParams } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatProvider, useSharedChat } from "@/hooks/useSharedChat";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

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
  const { 
    allSessions, 
    isLoadingConversations,
    input,
    setInput,
    isLoading,
    handleSubmit
  } = useSharedChat();
  
  const params = useParams({ strict: false });
  const currentChatId = params.chatId || null;

  const currentChatTitle = allSessions.find(s => s.id === currentChatId)?.title || (currentChatId ? "Conversation" : "New Chat");

  return (
    <SidebarProvider>
      <ChatSidebar
        chatSessions={allSessions}
        currentChatId={currentChatId}
        isLoading={isLoadingConversations}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
        {/* Fixed Header */}
        <header className="border-b bg-background px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold truncate px-1">
              {currentChatTitle}
            </h1>
          </div>
          <div id="chat-header-actions" className="flex items-center shrink-0" />
        </header>

        {/* Unified Scrollable Area */}
        <Conversation className="flex-1 overflow-y-auto">
          <ConversationContent className="p-0">
            <Outlet />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Shared Fixed Input area */}
        <div className="border-t p-4 shrink-0 bg-background">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <PromptInputSubmit disabled={isLoading} />
          </PromptInput>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
