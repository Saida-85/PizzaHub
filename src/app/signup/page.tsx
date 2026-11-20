"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pizza,
  Mail,
  Lock,
  User,
  Store,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRole = "customer" | "vendor";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 8) {
      toast.error(
        "Please fill all fields (password must be at least 8 characters).",
      );
      return;
    }

    // Better Auth signUp.email() will go here next
    toast.info(
      `Sign Up UI ready (${role === "vendor" ? "Vendor" : "Customer"}) — connect Better Auth next!`,
    );
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full bg-[#0B1315] flex items-center justify-center px-4 py-14 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,163,89,0.12),transparent_60%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md bg-[#0B1315] border border-[#D4A359]/25 p-7 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
      >
        {/* Brand Header */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-sm bg-[#0B1315] border border-[#D4A359]/40 flex items-center justify-center">
              <Pizza className="w-4 h-4 text-[#E05A2B]" />
            </span>
            <span className="text-xl font-extrabold tracking-[0.14em] text-white uppercase">
              Pizza<span className="text-[#D4A359]">Hub</span>
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-[#D4A359] font-semibold">
            Join PizzaHub
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-slate-300">
              Account Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 border text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  role === "customer"
                    ? "bg-[#E05A2B]/15 border-[#E05A2B] text-white"
                    : "bg-[#0B1315] border-[#D4A359]/20 text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#D4A359]" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 border text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  role === "vendor"
                    ? "bg-[#E05A2B]/15 border-[#E05A2B] text-white"
                    : "bg-[#0B1315] border-[#D4A359]/20 text-slate-400 hover:text-white"
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#D4A359]" />
                Vendor
              </button>
            </div>
          </div>

          {/* Full Name / Pizzeria Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs uppercase tracking-wider text-slate-300"
            >
              {role === "vendor" ? "Pizzeria / Business Name" : "Full Name"}
            </Label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="name"
                type="text"
                placeholder={
                  role === "vendor" ? "Hearth & Slice Co." : "Your Name"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 bg-[#0B1315] border-[#D4A359]/25 text-white placeholder:text-slate-500 rounded-none h-11 focus-visible:ring-[#D4A359]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs uppercase tracking-wider text-slate-300"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-[#0B1315] border-[#D4A359]/25 text-white placeholder:text-slate-500 rounded-none h-11 focus-visible:ring-[#D4A359]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs uppercase tracking-wider text-slate-300"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 bg-[#0B1315] border-[#D4A359]/25 text-white placeholder:text-slate-500 rounded-none h-11 focus-visible:ring-[#D4A359]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 mt-2 bg-[#E05A2B] hover:bg-[#c84b20] text-white rounded-none text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer"
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#D4A359] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
