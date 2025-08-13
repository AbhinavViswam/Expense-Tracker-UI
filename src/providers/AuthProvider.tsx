"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/backend/auth";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  refetch: () => void;
  setUser: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (data?.userData) {
      setUser(data.userData);
    } else {
      setUser(null);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
