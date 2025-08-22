"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Boxes,
  BadgeIndianRupee,
  User,
} from "lucide-react";

interface IBottomNav {
  user: any;
  refetch: any;
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/main" },
  // { name: "Wallet", icon: Wallet, path: "/main/wallet" },
  { name: "Expenses", icon: BadgeIndianRupee, path: "/main/expense" },
  { name: "Category", icon: Boxes, path: "/main/category" },
  { name: "Account", icon: User, path: "/main/account" },
];

const BottomBar = ({ user, refetch }: IBottomNav) => {
  
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 
        bg-white/90 backdrop-blur-lg border-t border-emerald-200 shadow-lg z-50
        md:bottom-3 md:left-1/2 md:-translate-x-1/2 md:w-[95%] md:max-w-3xl md:rounded-2xl
      `}
    >
      <ul className="flex justify-around md:justify-between items-center py-2 px-2 sm:px-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <li key={item.name}>
              <button
                className={`relative flex flex-col md:flex-row md:gap-2 items-center text-xs sm:text-sm transition-all px-3 py-1 rounded-lg ${
                  isActive
                    ? "text-emerald-600 font-semibold"
                    : "text-gray-500 hover:text-emerald-500"
                }`}
                onClick={() => router.push(item.path)}
              >
                <Icon
                  size={22}
                  className={`transition-transform ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                />
                <span className="mt-1 md:mt-0">{item.name}</span>

                {/* Active indicator (only on mobile) */}
                {isActive && (
                  <span className="absolute -bottom-1 md:hidden w-2 h-2 bg-emerald-500 rounded-full"></span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomBar;
