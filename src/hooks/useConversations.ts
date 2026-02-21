import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../lib/apiClient";

export interface ConversationListItem {
  _id: string;
  user: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsResponse {
  userId: string;
  conversations: {
    docs: ConversationListItem[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export const useConversations = (page = 1, limit = 20) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get<{
        success: boolean;
        data: ConversationsResponse;
      }>(`/api/v1/conversations?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });
};
