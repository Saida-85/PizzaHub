"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ImagePlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient, signIn, signUp } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRole = "customer" | "vendor";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function validatePassword(pw: string): string | null {
  if (pw.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pw)) return "Password needs one uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password needs one lowercase letter.";
  return null;
}

export default function SignUpPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const pwError = validatePassword(password);
    if (pwError) {
      toast.error(pwError);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        callbackURL: "/dashboard",
      } as Parameters<typeof signUp.email>[0]);

      if (error) {
        toast.error(error.message || "Could not create account.");
        return;
      }

      // Optional profile image: upload to ImgBB, then save it on the user.
      if (imageFile) {
        try {
          const fd = new FormData();
          fd.append("image", imageFile);
          const up = await api.post<{ url: string }>("/api/upload", fd);
          const { error: updateError } = await authClient.updateUser({
            image: up.url,
          });
          if (updateError) throw new Error(updateError.message);
        } catch {
          toast.warning(
            "Account created, but the profile image could not be uploaded. You can add it in Profile Settings.",
          );
        }
      }

      toast.success("Account created! Welcome to PizzaHub.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong while creating your account.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Google sign-up failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Could not start Google sign-up.");
      setIsGoogleLoading(false);
    }
  };

  const busy = isLoading || isGoogleLoading;

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full bg-[#0B1315] flex items-center justify-center px-4 py-14 relative overflow-hidden">
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
                placeholder="Min 6 chars, upper & lower case"
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
            <p className="text-[11px] text-slate-500">
              At least 6 characters with one uppercase and one lowercase letter.
            </p>
          </div>

          {/* Profile image (optional) */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-slate-300">
              Profile Image{" "}
              <span className="normal-case tracking-normal text-slate-500">
                (optional)
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#D4A359]/25 bg-[#132024] flex items-center justify-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-slate-500" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handlePick}
                  className="sr-only"
                />
                <label
                  htmlFor="profile-image"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 border border-[#D4A359]/40 bg-[#132024] px-3 text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-[#1a2b30]"
                >
                  <ImagePlus className="h-3.5 w-3.5 text-[#D4A359]" />
                  {preview ? "Change" : "Choose photo"}
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 px-2 text-[11px] uppercase tracking-wider text-slate-400 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 mt-2 bg-[#E05A2B] hover:bg-[#c84b20] text-white rounded-none text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
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

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={handleGoogleSignUp}
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
