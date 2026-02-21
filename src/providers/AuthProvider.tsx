import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, isLoaded: isClerkLoaded, isSignedIn } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isClerkLoaded) return;

      if (!isSignedIn) {
        setUser(null);
        setIsLoading(false);
        
        const currentPath = window.location.pathname;
        if (
          currentPath !== "/signin" &&
          currentPath !== "/signup" &&
          currentPath !== "/"
        ) {
          navigate({ to: "/signin" });
        }
        return;
      }

      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          const userData: UserData = data.data;
          setUser(userData);

          // Redirect and route protection rules
          const currentPath = window.location.pathname;
          
          if (userData.role === "farmer") {
            // Farmers shouldn't be on auth pages, root, or dashboard
            if (
              currentPath === "/signin" ||
              currentPath === "/signup" ||
              currentPath === "/" ||
              currentPath.startsWith("/dashboard")
            ) {
              navigate({ to: "/chat" });
            }
          } else if (userData.role === "officer") {
            // Officers shouldn't be on auth pages, root, or chat
            if (
              currentPath === "/signin" ||
              currentPath === "/signup" ||
              currentPath === "/" ||
              currentPath.startsWith("/chat")
            ) {
               navigate({ to: "/dashboard" } as any);
            }
          }
          console.log("User role:", userData.role);   
        } else {
            setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isClerkLoaded, isSignedIn, getToken, navigate]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => useContext(AuthContext);
