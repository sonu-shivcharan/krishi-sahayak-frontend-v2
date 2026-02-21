import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../lib/apiClient";

export const MessageSenderRole = {
  FARMER: "farmer",
  OFFICER: "officer",
  BOT: "bot",
} as const;
export type MessageSenderRole = (typeof MessageSenderRole)[keyof typeof MessageSenderRole];

export const MessageType = {
  TEXT: "text",
  MEDIA: "media",
  SYSTEM: "system",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface ConversationMessage {
  _id: string;
  conversation: string;
  senderRole: MessageSenderRole;
  type: MessageType;
  text?: string;
  files?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationDetail {
  _id: string;
  title?: string;
  messages: ConversationMessage[];
}

export const useConversation = (conversationId: string | undefined) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["conversation", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get<{
        success: boolean;
        data: ConversationDetail;
      }>(`/api/v1/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
};
