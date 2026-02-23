import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../lib/apiClient";

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  data?: {
    queryId?: string;
    conversationId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get<{
        success: boolean;
        data: Notification[];
      }>("/api/v1/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const token = await getToken();
      await apiClient.patch(
        `/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      await apiClient.patch(
        "/api/v1/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    unreadCount: (notificationsQuery.data || []).filter((n) => !n.isRead).length,
  };
};
