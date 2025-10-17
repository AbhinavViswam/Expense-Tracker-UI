"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/backend/user/user.query";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { setUser } = useAuthContext();
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.data?.data) {
            localStorage.setItem("token",res.data?.token)
            setUser(res.data.data);
            toast.success("Login successful!");
            router.push("/");
          } else {
            toast.error("Login failed!");
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary-focus to-secondary p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-primary/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-secondary/30">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary">
            Welcome Back
          </h1>
          <p className="mt-2 text-black text-sm sm:text-base italic">
            Log in to continue tracking your expenses
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`btn w-full bg-secondary text-white border-none hover:bg-secondary-focus transition-all duration-200 ${
              loginMutation.isPending ? "loading" : ""
            }`}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/auth/signup")}
            className="text-secondary hover:text-secondary-focus font-medium transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
