"use client";

import React from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useGetWallet } from "@/backend/wallet/wallet.query";
import { usePathname } from "next/navigation";
import BottomBar from "@/components/main/bottombar";
import { MailDropdown } from "@/components/main/MailComponent";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  setInterval(() => {
    queryClient.invalidateQueries({ queryKey: ["mail"] });
  }, 1000);

  const hiddenRoutes = ["/main/account", "/main/wallet"];
  const shouldShowWallet =
    user && !hiddenRoutes.some((route) => pathname.startsWith(route));

  return (
    <div className="flex h-screen relative bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="flex-1 overflow-auto text-black relative pb-20"> 
        {/* Page Transition */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-4xl mx-auto px-4 py-6"
        >
          {children}
        </motion.div>

        {/* Floating Wallet Card */}
        {/* <motion.div
         className="fixed top-5 right-40 z-50">

        <MailDropdown/>
        </motion.div>
        {shouldShowWallet && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 right-5 bg-emerald-400 backdrop-blur-xl border border-emerald-200/50 shadow-md rounded-full z-50 flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
          >
            <Wallet className="text-white" />
            <div className="font-semibold text-white">
              {walletIsLoading || walletIsReFetching
                ? "Loading..."
                : `₹${walletData?.data?.amount.toLocaleString("en-IN")}`}
            </div>
          </motion.div>
        )} */}
        <motion.div
  className="fixed top-5 right-5 z-50 flex items-center gap-4"
>
  <MailDropdown />

  {shouldShowWallet && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-emerald-400 backdrop-blur-xl border border-emerald-200/50 shadow-md rounded-full flex items-center justify-center gap-2 px-4 py-2 cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
    >
      <Wallet className="text-white" />
      <div className="font-semibold text-white text-sm sm:text-base">
        {walletIsLoading || walletIsReFetching
          ? "Loading..."
          : `₹${walletData?.data?.amount.toLocaleString("en-IN")}`}
      </div>
    </motion.div>
  )}
</motion.div>

      </div>

      {/* Bottom Navigation */}
      <BottomBar user={user} refetch={refetch} />
    </div>
  );
}
