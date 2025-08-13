"use client";

import React, { useState } from "react";
import { useLogout } from "@/backend/user/user.query";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Wallet,
  Boxes,
  User,
  LogOut,
} from "lucide-react";

interface Isidebar {
  user: any;
  refetch: any;
}

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/main" },
  { name: "Wallet", icon: Wallet, path: "/main/wallet" },
  { name: "Category", icon: Boxes, path: "/main/category" },
  { name: "Account", icon: User, path: "/main/account" },
];

const Sidebar = ({ user, refetch }: Isidebar) => {
  const logoutMutation = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
        router.push("/auth/login");
      },
      onError: () => alert("Failed to logout. Please try again."),
    });
  };

  return (
    <div
      className={`h-screen bg-white text-emerald-700 flex flex-col shadow-lg border-r border-emerald-400 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle */}
      <div className="flex justify-end p-2">
        <button
          className="btn btn-xs btn-ghost bg-white text-emerald-500 hover:bg-emerald-50 border-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Top User Section */}
      <div
        className={`flex flex-col items-center py-6 border-b border-emerald-100 transition-all duration-300 ${
          collapsed ? "px-2" : ""
        }`}
      >
        <div>{userNameProfile(user?.name)}</div>
        {!collapsed && (
          <>
            <h2 className="mt-3 font-semibold text-lg">{user?.name}</h2>
            <p className="text-sm text-emerald-500">{user?.email}</p>
          </>
        )}
      </div>

      {/* Menu */}
      <ul className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <li key={item.name}>
              <button
                className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
                onClick={() => router.push(item.path)}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-emerald-700"}
                />
                {!collapsed && item.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="p-4 border-t border-emerald-100">
        <button
          className="btn w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut size={20} />
          {!collapsed && (logoutMutation.isPending ? "Logging out..." : "Logout")}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

export const userNameProfile = (name: string) => {
  if (!name) return null;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length === 1 ? parts[0][0] : parts[0][0] + parts[parts.length - 1][0];

  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white font-bold uppercase shadow-md">
      {initials}
    </div>
  );
};
