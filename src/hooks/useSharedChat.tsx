import { createContext, useContext, type ReactNode } from "react";
import { useChatStream } from "./use-chat-stream";
import { useConversations } from "./useConversations";

type UseChatStreamReturn = ReturnType<typeof useChatStream>;

export type SharedChatContextType = UseChatStreamReturn & {
  allSessions: { id: string; title: string }[];
  isLoadingConversations: boolean;
};

const ChatContext = createContext<SharedChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatStream = useChatStream();
  const { data: conversationsResponse, isLoading } = useConversations();

  const backendSessions = conversationsResponse?.conversations?.docs?.map(doc => ({
    id: doc._id,
    title: doc.title,
  })) || [];

  const localSessions = chatStream.chatSessions.filter(local => 
    !backendSessions.some(backend => backend.id === local.id)
  ).map(local => ({
    id: local.id,
    title: local.title,
  }));

  const allSessions = [...localSessions, ...backendSessions];

  return (
    <ChatContext.Provider value={{ ...chatStream, allSessions, isLoadingConversations: isLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useSharedChat must be used within a ChatProvider");
  }
  return context;
}
