"use client";

import { Conversation, ConversationContent } from "../ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "../ai-elements/prompt-input";
import { Shimmer } from "../ai-elements/shimmer";
import { ChatSidebar } from "../chat-sidebar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MenuIcon, BotIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSharedChat } from "@/hooks/useSharedChat";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export function Chat() {
  const {
    chatSessions,
    allSessions,
    currentChatId,
    input,
    isLoading,
    setInput,
    handleSubmit,
  } = useSharedChat();

  const navigate = useNavigate();

  useEffect(() => {
    // A valid MongoDB ObjectId is typical for backend conversation IDs, so it is 24 hex characters.
    if (!isLoading && currentChatId && currentChatId.length >= 24) {
      navigate({ to: "/c/$chatId", params: { chatId: currentChatId } });
    }
  }, [isLoading, currentChatId, navigate]);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="border-b bg-background px-4 py-3 flex items-center justify-between shrink-0">
        {/* Mobile Menu Button */}
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
        <h1 className="text-lg font-semibold">Krishi Sahayak</h1>
        <div className="w-10 md:hidden" /> {/* Spacer for centering */}
      </div>
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((message) => {
            const layoutRole = message.role;
            const label = message.role === 'user' ? 'You' : 'Krishi AI';
            const icon = message.role === 'user' ? <UserIcon className="h-3 w-3" /> : <BotIcon className="h-3 w-3" />;
            
            return (
              <div key={message.id} className="flex flex-col gap-1">
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
                    {message.role === "assistant" ? (
                      message.content.startsWith("shimmer:") ? (
                        <Shimmer>
                          {message.content.replace("shimmer:", "")}
                        </Shimmer>
                      ) : (
                        <MessageResponse>{message.content}</MessageResponse>
                      )
                    ) : (
                      <span>{message.content}</span>
                    )}
                  </MessageContent>
                </Message>
              </div>
            );
          })}
        </ConversationContent>
      </Conversation>

      <div className="border-t p-4 shrink-0">
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
    </div>
  );
}
