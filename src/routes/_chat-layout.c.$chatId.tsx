import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useConversation, MessageSenderRole, MessageType } from "@/hooks/useConversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ChatSidebar } from "@/components/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, BotIcon, UserIcon, ShieldIcon, Forward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSharedChat } from "@/hooks/useSharedChat";
import { cn } from "@/lib/utils";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "@/lib/apiClient";

export const Route = createFileRoute("/_chat-layout/c/$chatId")({
  component: RouteComponent,
});

/** Maps senderRole to what the Message component expects for layout purposes */
function getSenderLayoutRole(senderRole: MessageSenderRole): "user" | "assistant" {
  // farmer messages appear on the right (user), bot/officer on the left (assistant)
  return senderRole === MessageSenderRole.FARMER ? "user" : "assistant";
}

/** Returns a human-readable label for the sender */
function getSenderLabel(senderRole: MessageSenderRole): string {
  switch (senderRole) {
    case MessageSenderRole.FARMER:
      return "You";
    case MessageSenderRole.BOT:
      return "Krishi AI";
    case MessageSenderRole.OFFICER:
      return "Officer";
  }
}

function getSenderIcon(senderRole: MessageSenderRole) {
  switch (senderRole) {
    case MessageSenderRole.FARMER:
      return <UserIcon className="h-3 w-3" />;
    case MessageSenderRole.BOT:
      return <BotIcon className="h-3 w-3" />;
    case MessageSenderRole.OFFICER:
      return <ShieldIcon className="h-3 w-3" />;
  }
}

function RouteComponent() {
  const { chatId } = Route.useParams();
  const { data, isLoading, isError } = useConversation(chatId);
  const { getToken } = useAuth();

  const forwardMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiClient.post(
        "/api/v1/forwarded-queries/forward",
        { conversationId: chatId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      alert("Conversation forwarded to officer successfully!");
    },
    onError: (error) => {
      console.error("Failed to forward conversation", error);
      alert("Failed to forward conversation. Please try again.");
    },
  });

  const {
    chatSessions,
    allSessions,
    currentChatId,
    input,
    isLoading: isSending,
    setInput,
    setCurrentChatId,
    handleSubmit,
  } = useSharedChat();

  React.useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      setCurrentChatId(chatId);
    }
  }, [chatId, currentChatId, setCurrentChatId]);
  
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <ChatSidebar
              chatSessions={allSessions}
              currentChatId={currentChatId}
            />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold flex-1 text-center md:text-left px-2 truncate">
          {data?.title || "Conversation"}
        </h1>
        <div className="flex items-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => forwardMutation.mutate()}
            disabled={forwardMutation.isPending}
            className="gap-2"
          >
            <Forward className="h-4 w-4" />
            <span className="hidden sm:inline">
              {forwardMutation.isPending ? "Forwarding..." : "Forward to Officer"}
            </span>
          </Button>
        </div>
      </div>

      {/* Message area */}
        <Conversation className="flex-1">
          <ConversationContent>
            {isLoading && chatSessions.find(s => s.id === currentChatId)?.messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading messages...
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center h-full text-destructive text-sm">
                Failed to load conversation.
              </div>
            )}

            {!isLoading && !isError && data?.messages?.length === 0 && chatSessions.find(s => s.id === currentChatId)?.messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No messages in this conversation yet.
              </div>
            )}

            {!isLoading && data?.messages && data.messages.length > 0 &&
              [...data.messages].reverse().map((message) => {
                const layoutRole = getSenderLayoutRole(message.senderRole);
                const label = getSenderLabel(message.senderRole);
                const icon = getSenderIcon(message.senderRole);
                const isSystem = message.type === MessageType.SYSTEM;

                // System messages: centered pill badge
                if (isSystem) {
                  return (
                    <div
                      key={message._id}
                      className="flex justify-center my-2"
                    >
                      <Badge variant="secondary" className="text-xs gap-1">
                        {icon}
                        {message.text}
                      </Badge>
                    </div>
                  );
                }

                return (
                  <div key={message._id} className="flex flex-col gap-1">
                    {/* Sender label row */}
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs text-muted-foreground px-1",
                        layoutRole === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {icon}
                      <span>{label}</span>
                    </div>

                    <Message from={layoutRole}>
                      <MessageContent>
                        {message.senderRole === MessageSenderRole.BOT ? (
                          <MessageResponse>{message.text ?? ""}</MessageResponse>
                        ) : (
                          <span>{message.text}</span>
                        )}
                        {/* Media attachments */}
                        {message.type === MessageType.MEDIA &&
                          message.files?.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-xs underline text-primary mt-1"
                            >
                              Attachment {i + 1}
                            </a>
                          ))}
                      </MessageContent>
                    </Message>
                  </div>
                );
              })}

            {/* Render current active session messages */}
            {chatSessions.find(s => s.id === currentChatId)?.messages.map((msg) => {
              const layoutRole = msg.role;
              const label = msg.role === 'user' ? 'You' : 'Krishi AI';
              const icon = msg.role === 'user' ? <UserIcon className="h-3 w-3" /> : <BotIcon className="h-3 w-3" />;
              
              return (
                <div key={msg.id} className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs text-muted-foreground px-1",
                      layoutRole === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {icon}
                    <span>{label}</span>
                  </div>

                  <Message from={layoutRole}>
                    <MessageContent>
                      {msg.role === "assistant" ? (
                        msg.content.startsWith("shimmer:") ? (
                          <Shimmer>{msg.content.replace("shimmer:", "")}</Shimmer>
                        ) : (
                          <MessageResponse>{msg.content}</MessageResponse>
                        )
                      ) : (
                        <span>{msg.content}</span>
                      )}
                    </MessageContent>
                  </Message>
                </div>
              );
            })}
          </ConversationContent>
        </Conversation>

        {/* Input area */}
        <div className="border-t p-4 shrink-0">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
            />
            <PromptInputSubmit disabled={isSending} />
          </PromptInput>
        </div>
      </div>
  );
}
