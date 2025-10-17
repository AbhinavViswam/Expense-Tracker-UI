"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignup } from "@/backend/user/user.query";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/providers/AuthProvider";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData, {
      onSuccess: (res) => {
        if (res?.data?.data?.data) {
          localStorage.setItem("token",res.data?.token)
          setUser(res.data.data.data);
          toast.success("Login successful!");
          router.push("/");
        } else {
          toast.error("Login failed!");
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary-focus to-secondary p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-primary/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-secondary/30">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-secondary">
            Create Account
          </h1>
          <p className="mt-2 text-black text-sm sm:text-base italic">
            Track every penny, grow every dollar.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full border-white/40 focus:border-secondary focus:ring-2 focus:ring-secondary text-white placeholder-gray-400"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {signupMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {(signupMutation.error as any)?.response?.data?.message ||
                "Signup failed"}
            </p>
          )}

          <button
            type="submit"
            className={`btn w-full bg-secondary text-white border-none hover:bg-secondary-focus transition-all duration-200 ${
              signupMutation.isPending ? "loading" : ""
            }`}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-secondary hover:text-secondary-focus font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
