"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else {
      router.replace("/main");
    }
  }, [user]);
  return <div className="bg-white"></div>;
}
