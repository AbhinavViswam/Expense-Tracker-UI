"use client";

import React from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import Sidebar from "@/components/main/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, refetch } = useAuthContext();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} refetch={refetch} />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-6 overflow-auto text-black">{children}</div>
    </div>
  );
}
