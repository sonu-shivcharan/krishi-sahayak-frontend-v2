"use client";

import { useState } from "react";
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

export function Chat() {
  const [chatSessions, setChatSessions] = useState<
    Array<{
      id: string;
      title: string;
      messages: Array<{
        id: string;
        role: "user" | "assistant";
        content: string;
      }>;
    }>
  >([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChatSessions((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title:
                firstMessage.slice(0, 30) +
                (firstMessage.length > 30 ? "..." : ""),
            }
          : chat,
      ),
    );
  };

  const updateMessages = (newMessages: typeof messages) => {
    if (!currentChatId) return;
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat,
      ),
    );
  };

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text.trim() || isLoading) return;

    if (!currentChatId) {
      createNewChat();
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message.text,
    };

    const assistantId = (Date.now() + 1).toString();
    const newMessages = [
      ...messages,
      userMessage,
      { id: assistantId, role: "assistant" as const, content: "" },
    ];

    updateMessages(newMessages);

    if (messages.length === 0) {
      updateChatTitle(currentChatId, message.text);
    }

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message.text,
          conversationId: currentChatId,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event:status")) {
            const nextLine = lines[lines.indexOf(line) + 1];
            if (nextLine?.startsWith("data:")) {
              try {
                const data = JSON.parse(nextLine.slice(5));
                if (data.type === "thinking") {
                  updateMessages(
                    newMessages.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: "shimmer:Thinking..." }
                        : msg,
                    ),
                  );
                } else if (data.type === "tool_start") {
                  updateMessages(
                    newMessages.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: "shimmer:Using tools..." }
                        : msg,
                    ),
                  );
                } else if (data.type === "tool_end") {
                  updateMessages(
                    newMessages.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: "shimmer:Processing results..." }
                        : msg,
                    ),
                  );
                }
              } catch (e) {
                console.error("Failed to parse status data:", e);
              }
            }
          } else if (line.startsWith("event:final")) {
            const nextLine = lines[lines.indexOf(line) + 1];
            if (nextLine?.startsWith("data:")) {
              try {
                const data = JSON.parse(nextLine.slice(5));
                if (data.answer) {
                  updateMessages(
                    newMessages.map((msg) =>
                      msg.id === assistantId
                        ? { ...msg, content: data.answer }
                        : msg,
                    ),
                  );
                }
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      updateMessages(
        newMessages.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "Error: Failed to get response" }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

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
