"use client";
import React from "react";
import { User, Mail, Phone, Calendar, LogOut } from "lucide-react";
import { useAuthContext } from "@/providers/AuthProvider";
import dayjs from "dayjs";
import { useLogout } from "@/backend/user/user.query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Page() {
  const { user } = useAuthContext();
  const logoutMutation = useLogout();
  const router = useRouter();

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No user data available.</p>
      </section>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/auth/login"),
      onError: () => toast("Failed to logout. Please try again."),
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-6">
      <div className="relative bg-white shadow-2xl rounded-3xl p-10 max-w-lg w-full border border-emerald-100">
        {/* Logout Button (top-right corner) */}
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="absolute top-4 right-4 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition disabled:opacity-50"
        >
          <LogOut size={18} />
          <span>{logoutMutation.isPending ? "..." : "Logout"}</span>
        </button>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-100 rounded-full shadow-md">
            <User className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-extrabold text-emerald-700 text-center mb-6">
          {user.name}
        </h1>

        {/* Details */}
        <div className="space-y-4 text-gray-700">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-600" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-600" />
            <span>{user.phone || "No phone added"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>
              Joined {dayjs(user.createdAt).format("DD MMM YYYY")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          This section is under development...
        </p>
      </div>
    </section>
  );
}

export default Page;
