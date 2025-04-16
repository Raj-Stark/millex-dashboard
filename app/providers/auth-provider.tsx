"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      document.cookie = `token=${newToken}; Path=/; Max-Age=${
        3600 * 24 * 7
      }; HttpOnly; SameSite=Strict`; // Example: Set cookie for 7 days
    } else {
      localStorage.removeItem("token");
      document.cookie = "token=; Max-Age=0; path=/";
      queryClient.clear();
    }
  };

  // Initialize token from localStorage or cookies
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || getCookie("token");
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// Helper function to get cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}
