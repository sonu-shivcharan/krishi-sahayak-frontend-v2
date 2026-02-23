import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "../lib/apiClient";
import type { ForwardedQuery } from "./useOfficerQueries";

// Hook to fetch all queries forwarded by the logged-in farmer
export const useFarmerQueries = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["farmerQueries"],
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
      }>("/api/v1/forwarded-queries/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data.data.docs;
    },
  });
};
