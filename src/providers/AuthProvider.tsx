"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/backend/auth";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      if (data?.userData) {
        setUser(data.userData);
      } else {
        setUser(null);
        router.replace("/auth/login");
      }
    }
  }, [data, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-white">
        <h1 className="text-emerald-700">LOADING DATA</h1>
        <span className="loading loading-bars loading-xl text-emerald-700"></span>
      </div>
    );
  }

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
