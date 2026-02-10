"use client";

import { Conversation, ConversationContent } from "./ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "./ai-elements/prompt-input";
import { Shimmer } from "./ai-elements/shimmer";
import { ChatSidebar } from "./chat-sidebar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { MenuIcon } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";

export function Chat() {
  const {
    chatSessions,
    currentChatId,
    input,
    isLoading,
    setInput,
    setCurrentChatId,
    createNewChat,
    handleSubmit,
  } = useChatStream();

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={setCurrentChatId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <ChatSidebar
                chatSessions={chatSessions}
                currentChatId={currentChatId}
                onNewChat={createNewChat}
                onSelectChat={setCurrentChatId}
              />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Krishi Sahayak</h1>
          <div className="w-10 md:hidden" /> {/* Spacer for centering */}
        </div>
        <Conversation className="flex-1">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
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
                    message.content
                  )}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
        </Conversation>

        <div className="border-t p-4">
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
    </div>
  );
}
