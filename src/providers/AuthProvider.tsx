import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { isAxiosError } from "axios";

type UserData = {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  address: string;
  role: "farmer" | "officer" | string;
};

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

const PUBLIC_ROUTES = ["/signin", "/signup", "/"];
const COMMON_RESTRICTED_ROUTES = ["/signin", "/signup", "/"];

const isFarmerRoute = (path: string) => path.startsWith("/chat") || path.startsWith("/c/");
const isOfficerRoute = (path: string) => path.startsWith("/dashboard");

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded: isClerkLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const { data: user = null, isLoading: isQueryLoading, error } = useQuery({
    queryKey: ["user", isSignedIn],
    queryFn: async () => {
      if (!isSignedIn) return null;
      const token = await getToken();
      if (!token) return null;

      const response = await apiClient.get('/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data as UserData;
    },
    enabled: isClerkLoaded,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: (failureCount, err) => {
      if (isAxiosError(err) && err.response?.status === 404) {
        return false; // Do not retry if onboarding profile is missing
      }
      return failureCount < 3;
    }
  });

  const isLoading = !isClerkLoaded || isQueryLoading;

  useEffect(() => {
    if (!isClerkLoaded) return;

    const currentPath = window.location.pathname;

    // 1. Not signed in
    if (!isSignedIn) {
      if (!PUBLIC_ROUTES.includes(currentPath)) {
        navigate({ to: "/signin" });
      }
      return;
    }

    // 2. Signed in, but profile not found (404) - Onboarding not completed
    if (error && isAxiosError(error) && error.response?.status === 404) {
      if (currentPath !== "/onboard") {
        navigate({ to: "/onboard", });
      }
      return;
    }

    // 3. Signed in and profile exists
    if (user) {
      if (user.role === "farmer") {
        if (COMMON_RESTRICTED_ROUTES.includes(currentPath) || isOfficerRoute(currentPath)) {
          navigate({ to: "/chat" });
        }
      } else if (user.role === "officer") {
        if (COMMON_RESTRICTED_ROUTES.includes(currentPath) || isFarmerRoute(currentPath)) {
          navigate({ to: "/dashboard" } as any);
        }
      }
      console.log("User role:", user.role);
    }
  }, [isClerkLoaded, isSignedIn, user, error, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
};
