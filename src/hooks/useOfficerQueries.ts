import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../lib/apiClient";

export interface ForwardedQuery {
  _id: string;
  conversation: string;
  forwardedBy: {
    _id: string;
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
  };
  targetOfficers: string[];
  location?: {
    type: "Point";
    coordinates: number[];
    district?: string;
    taluka?: string;
  };
  status: "pending" | "answered";
  answer?: string;
  forwardedAt: string;
  answeredBy?: string;
  answeredAt?: string;
  question?: string;
  summary?: string;
  __v?: number;

  // Added virtual properties to maintain compatibility with the UI until backend populates these fields:
  userContext?: {
    userName: string;
    location: string;
  };
  originalQuery?: string;
  relevantMessages?: {
    role: string;
    content: string;
    timestamp: string;
  }[];
}

// Hook to fetch all queries for the logged-in officer
export const useOfficerQueries = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["officerQueries"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get<{
        success: boolean;
        data: {
          docs: ForwardedQuery[];
          totalDocs: number;
          page: number;
          totalPages: number;
        };
      }>("/api/v1/forwarded-queries/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Map API response to include virtual fields required by the UI
      return response.data.data.docs.map((query) => {
        const fallbackLocation = [query.location?.taluka, query.location?.district].filter(Boolean).join(", ");
        return {
          ...query,
          userContext: query.userContext || {
            userName: query.forwardedBy?.name || "Anonymous Farmer",
            location: query.forwardedBy?.address || fallbackLocation || "Unknown Location",
          },
          originalQuery: query.question || query.originalQuery || `Query regarding conversation ID: ${query.conversation}`,
        };
      });
    },
  });
};

// Hook to submit an answer to a query
export const useAnswerQuery = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      queryId,
      answer,
    }: {
      queryId: string;
      answer: string;
    }) => {
      const token = await getToken();
      const response = await apiClient.patch(
        `/api/v1/forwarded-queries/${queryId}/answer`,
        { answer },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the queries list to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["officerQueries"] });
    },
  });
};

// Hook to fetch a user profile by ID (Officer Only)
export const useUser = (userId: string | undefined) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return null;
      const token = await getToken();
      const response = await apiClient.get<{
        success: boolean;
        data: {
          _id: string;
          name: string;
          email: string;
          profileImage?: string;
          address?: string;
          location?: {
            type: string;
            coordinates: number[];
            district?: string;
            taluka?: string;
          };
          role: string;
        };
      }>(`/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!userId,
  });
};
