"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/backend/user/user.query";
import { useAuthContext } from "@/providers/AuthProvider";
import { toast } from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { setUser } = useAuthContext();
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          setIsLoading(false);
          if (res.data?.data) {
            localStorage.setItem("token", res.data?.token);
            setUser(res.data.data);
            toast.success("Login successful!");
            router.push("/");
          } else {
            toast.error("Login failed!");
          }
        },
        onError: (err: any) => {
          setIsLoading(false);
          toast.error(err?.response?.data?.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-200">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Log in to continue tracking your expenses
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium text-sm">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input w-full pl-12 pr-4 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium text-sm">
                  Password
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input w-full pl-12 pr-12 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="label cursor-pointer flex items-center gap-2 p-0">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-success"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="label-text text-gray-600 text-sm">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-none h-14 rounded-xl text-base font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/signup")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline decoration-emerald-400 underline-offset-2"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-500 text-xs flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
}
