"use client";

import React from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import Sidebar from "@/components/main/sidebar";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useGetWallet } from "@/backend/wallet/wallet.query";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, refetch } = useAuthContext();
  const {
    data: walletData,
    isLoading: walletIsLoading,
    isRefetching: walletIsReFetching,
    isError: walletIsError,
  } = useGetWallet();

  const pathname = usePathname();

  const hiddenRoutes = ["/main/account", "/main/wallet"];

  const shouldShowWallet =
    user && !hiddenRoutes.some((route) => pathname.startsWith(route));

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar user={user} refetch={refetch} />

      {/* Main Content */}
      <div className="flex-1 bg-white overflow-auto text-black relative">
        {children}

        {/* Floating Badge (Dynamic Island style) */}
        {shouldShowWallet && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 right-4 bg-secondary text-white rounded-full shadow-lg z-50 flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:scale-110 transition-all"
          >
            <Wallet />
            <div className="font-bold">
              ₹{walletData?.data?.amount.toLocaleString("en-IN")}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
