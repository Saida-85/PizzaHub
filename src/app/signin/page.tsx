"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pizza, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Signed in to PizzaHub!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong while signing in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Could not start Google sign-in.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full bg-[#0B1315] flex items-center justify-center px-4 py-14 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(224,90,43,0.12),transparent_60%)]"
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
            Member Access
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white tracking-tight">
            Sign In to PizzaHub
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-slate-300"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#D4A359] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            disabled={isLoading || isGoogleLoading}
            className="w-full h-11 bg-[#E05A2B] hover:bg-[#c84b20] text-white rounded-none text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] uppercase tracking-widest text-slate-400">
            Or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          disabled={isLoading || isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="w-full h-11 rounded-none border-[#D4A359]/40 bg-[#132024] hover:bg-[#1a2b30] text-white text-xs uppercase tracking-[0.16em] font-semibold cursor-pointer flex items-center justify-center gap-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.6 2.8C6.1 7.2 8.8 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.2 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.6-2.8z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.9-2.2-6.8-5.1l-3.6 2.8C3.5 21.4 7.4 24 12 24z"
            />
          </svg>
          <span>
            {isGoogleLoading
              ? "Redirecting to Google..."
              : "Continue with Google"}
          </span>
        </Button>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to PizzaHub?{" "}
          <Link
            href="/signup"
            className="text-[#D4A359] font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
