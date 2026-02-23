"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "../ai-elements/message";
import { Shimmer } from "../ai-elements/shimmer";
import { BotIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSharedChat } from "@/hooks/useSharedChat";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function Chat() {
  const {
    chatSessions,
    currentChatId,
    isLoading,
    setCurrentChatId,
    setChatSessions,
    setInput,
  } = useSharedChat();

  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);

  // Monitor when the first message is sent to allow redirection
  useEffect(() => {
    if (isLoading) {
      setHasStarted(true);
    }
  }, [isLoading]);

  // On mount, clear the current chat state to ensure we're starting fresh.
  useEffect(() => {
    setCurrentChatId(null);
    setChatSessions([]);
    setInput("");
    setHasStarted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only redirect if:
    // 1. We've actually started a conversation in THIS session
    // 2. We have a valid backend ID (24+ chars)
    // 3. We're not currently loading/sending
    if (hasStarted && !isLoading && currentChatId && currentChatId.length >= 24) {
      navigate({ to: "/c/$chatId", params: { chatId: currentChatId } });
    }
  }, [hasStarted, isLoading, currentChatId, navigate]);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  return (
    <div className="flex flex-col gap-8 p-4">
      {messages.map((message) => {
        const layoutRole = message.role;
        const label = message.role === "user" ? "You" : "Krishi AI";
        const icon =
          message.role === "user" ? (
            <UserIcon className="h-3 w-3" />
          ) : (
            <BotIcon className="h-3 w-3" />
          );

        return (
          <div key={message.id} className="flex flex-col gap-1">
            <div
              className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground px-1",
                layoutRole === "user" ? "justify-end" : "justify-start",
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
    </div>
  );
}
