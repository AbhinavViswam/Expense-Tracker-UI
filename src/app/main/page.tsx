"use client";

import Sidebar from "@/components/main/sidebar";
import { useAuthContext } from "@/providers/AuthProvider";
import React from "react";

export default function MainPage() {
  const { user, refetch } = useAuthContext();
  return (
    <div className="bg-white">
     
    </div>
  );
}
