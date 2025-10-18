"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/backend/user/user.query";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const signupMutation = useSignup();
  const { setUser } = useAuthContext();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: "", color: "" };
    if (pass.length < 2)
      return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 5)
      return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (pass.length < 7)
      return { strength: 3, label: "Good", color: "bg-emerald-400" };
    return { strength: 4, label: "Strong", color: "bg-emerald-600" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    signupMutation.mutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.data?.data) {
          localStorage.setItem("token", res.data?.token);
          setUser(res.data.data.data);
          toast.success("Signup successful!");
          router.push("/");
        } else {
          toast.error("Signup failed!");
        }
      },
      onError: () => {
        toast.error("Signup failed! Please try again.");
      },
    });
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

      {/* Sign Up Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-200">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Track every penny, grow every dollar.
            </p>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium text-sm">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="input w-full pl-12 pr-4 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium text-sm">
                  Phone Number
                </span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  className="input w-full pl-12 pr-4 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  name="email"
                  placeholder="you@example.com"
                  className="input w-full pl-12 pr-4 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="Create a strong password"
                  className="input w-full pl-12 pr-12 bg-emerald-50/50 border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 text-gray-800 placeholder-gray-400 transition-all duration-200 rounded-xl"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p
                    className={`text-xs ${
                      passwordStrength.strength >= 3
                        ? "text-emerald-600"
                        : passwordStrength.strength === 2
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Password strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {signupMutation.isError && (
              <div className="alert bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-red-600 shrink-0 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-red-700 text-sm">
                  {(signupMutation.error as any)?.response?.data?.message ||
                    "Signup failed"}
                </span>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-none h-14 rounded-xl text-base font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {signupMutation.isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 underline decoration-emerald-400 underline-offset-2"
            >
              Login
            </button>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-gray-500 text-xs flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
}
