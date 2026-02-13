import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

interface UseChatStreamReturn {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  input: string;
  isLoading: boolean;
  setInput: (input: string) => void;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => void;
  handleSubmit: (message: { text: string }) => Promise<void>;
}

export function useChatStream(): UseChatStreamReturn {
  const { getToken } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = () => {
    const newChat: ChatSession = {
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

  const handleSubmit = async (message: { text: string }) => {
    if (!message.text.trim() || isLoading) return;

    let tempChatId = currentChatId;
    if (!tempChatId) {
      // Create a temporary chat for optimistic UI
      tempChatId = Date.now().toString();
      const newChat: ChatSession = {
        id: tempChatId,
        title: "New Chat",
        messages: [],
      };
      setChatSessions((prev) => [newChat, ...prev]);
      setCurrentChatId(tempChatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.text,
    };

    const assistantId = (Date.now() + 1).toString();

    // Update local state immediately
    setChatSessions((prev) => {
      const chatIndex = prev.findIndex((c) => c.id === tempChatId);
      if (chatIndex === -1) return prev;

      const updatedChat = {
        ...prev[chatIndex],
        messages: [
          ...prev[chatIndex].messages,
          userMessage,
          { id: assistantId, role: "assistant" as const, content: "" },
        ],
      };

      const newSessions = [...prev];
      newSessions[chatIndex] = updatedChat;
      return newSessions;
    });

    if (chatSessions.find((c) => c.id === tempChatId)?.messages.length === 0) {
      updateChatTitle(tempChatId, message.text);
    }

    setInput("");
    setIsLoading(true);

    try {
      // Determine endpoint and payload
      // Valid backend IDs are MongodDB ObjectIds (24 hex chars).
      // Temp IDs are Timestamps (usually shorter or just digits).
      const isNewConversation = tempChatId.length < 24;

      const url = isNewConversation
        ? "http://localhost:3000/api/v1/conversations/start"
        : `http://localhost:3000/api/v1/conversations/${tempChatId}`;
      const token = await getToken({ skipCache: true });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.text,
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
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.trim() === "") continue;
          if (line.startsWith("event:")) {
            const eventType = line.slice(6).trim();

            if (i + 1 < lines.length) {
              const nextLine = lines[i + 1];
              if (nextLine.startsWith("data:")) {
                // Skip the data line in the next iteration
                i++;

                const dataStr = nextLine.slice(5);
                try {
                  const data = JSON.parse(dataStr);

                  if (eventType === "initial") {
                    const { conversationId, conversationTitle } = data;

                    if (conversationId && tempChatId !== conversationId) {
                      // Replace temp ID with real ID
                      setChatSessions((prev) =>
                        prev.map((chat) =>
                          chat.id === tempChatId
                            ? {
                                ...chat,
                                id: conversationId,
                                title: conversationTitle || chat.title,
                              }
                            : chat,
                        ),
                      );
                      setCurrentChatId(conversationId);
                    }
                  } else if (eventType === "status") {
                    let statusText = "";
                    if (data.type === "thinking") {
                      statusText = "shimmer:Thinking...";
                    } else if (data.type === "toolCall") {
                      statusText = `shimmer:Using tool ${data.name || ""}...`;
                    }

                    if (statusText) {
                      setChatSessions((prev) => {
                        return prev.map((chat) => ({
                          ...chat,
                          messages: chat.messages.map((msg) =>
                            msg.id === assistantId
                              ? { ...msg, content: statusText }
                              : msg,
                          ),
                        }));
                      });
                    }
                  } else if (eventType === "chunk") {
                    const content =
                      data.chunkContent ||
                      data.content ||
                      (typeof data === "string" ? data : "");

                    if (content) {
                      setChatSessions((prev) => {
                        return prev.map((chat) => ({
                          ...chat,
                          messages: chat.messages.map((msg) => {
                            if (msg.id === assistantId) {
                              if (msg.content.startsWith("shimmer:")) {
                                return { ...msg, content: content };
                              }
                              return { ...msg, content: msg.content + content };
                            }
                            return msg;
                          }),
                        }));
                      });
                    }
                  } else if (eventType === "end") {
                    // Stream finished
                  }
                } catch (e) {
                  console.error("Failed to parse SSE data:", e);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatSessions((prev) => {
        // Find chat with this message
        return prev.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: msg.content + "\n[Error: Failed to get response]",
                }
              : msg,
          ),
        }));
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    chatSessions,
    currentChatId,
    input,
    isLoading,
    setInput,
    setCurrentChatId,
    createNewChat,
    handleSubmit,
  };
}
