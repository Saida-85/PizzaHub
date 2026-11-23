"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Flame,
  LayoutDashboard,
  LogOut,
  Menu,
  Pizza,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  UserCog,
  UtensilsCrossed,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface MobileMenuUser {
  name: string;
  email: string;
  image?: string | null;
}

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: MobileMenuUser;
  role: "customer" | "vendor" | "admin";
  isPending: boolean;
  links: { label: string; href: string }[];
  pathname: string;
  dashboardHref: string;
  onLogout: () => void;
}

// One icon per link so the list is quick to scan on a small screen.
const ICONS: Record<string, LucideIcon> = {
  "/": Flame,
  "/menu": UtensilsCrossed,
  "/dashboard/vendor/add-item": Plus,
  "/dashboard/vendor/orders": ClipboardList,
  "/dashboard/admin": ShieldCheck,
};

export default function MobileMenu({
  open,
  onOpenChange,
  user,
  role,
  isPending,
  links,
  pathname,
  dashboardHref,
  onLogout,
}: MobileMenuProps) {
  const close = () => onOpenChange(false);
  const isActive = (href: string) => pathname === href;
  const dashboardActive = pathname.startsWith("/dashboard");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4A359]/30 bg-[#132024] text-[#D4A359] transition-colors active:scale-95 hover:border-[#D4A359]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[88%] max-w-sm gap-0 border-l border-[#D4A359]/25 bg-[#0B1315] p-0 text-white"
      >
        <SheetTitle className="sr-only">Main menu</SheetTitle>
        <SheetDescription className="sr-only">
          Site navigation and account options
        </SheetDescription>

        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#D4A359]/15 px-5">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2.5"
            aria-label="PizzaHub home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4A359]/60 bg-[#132024]">
              <Pizza className="h-4 w-4 -rotate-12 text-[#E05A2B]" />
            </span>
            <span className="text-lg font-bold uppercase tracking-[0.16em] leading-none">
              Pizza<span className="text-[#D4A359]">Hub</span>
            </span>
          </Link>

          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors active:scale-95 hover:bg-white/10 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </SheetClose>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
          {/* Account card */}
          {isPending ? (
            <div className="h-[84px] animate-pulse rounded-2xl bg-[#132024]" />
          ) : user ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl border border-[#D4A359]/25 bg-gradient-to-br from-[#E05A2B]/20 via-[#132024] to-[#132024] p-4"
            >
              <div className="flex items-center gap-3.5">
                <Avatar className="h-12 w-12 border-2 border-[#D4A359]/60">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback className="bg-[#E05A2B] text-sm font-bold text-white">
                    {user.name?.slice(0, 2).toUpperCase() || "PH"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user.email}
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-[#D4A359]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#D4A359]">
                    {role}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-[#D4A359]/25 bg-gradient-to-br from-[#E05A2B]/20 via-[#132024] to-[#132024] p-4"
            >
              <p className="text-sm font-semibold text-white">
                Hungry? Let&apos;s fix that.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Sign in to order, track deliveries and save your favorites.
              </p>
            </motion.div>
          )}

          {/* Navigation */}
          <nav aria-label="Mobile">
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Explore
            </p>
            <ul className="space-y-1.5">
              {links.map((link, i) => {
                const Icon = ICONS[link.href] ?? Flame;
                const active = isActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + i * 0.045 }}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex min-h-12 items-center gap-3.5 rounded-xl px-3.5 text-sm font-medium transition-colors active:scale-[0.98] ${
                        active
                          ? "bg-[#E05A2B]/12 text-[#D4A359]"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-[#E05A2B]" />
                      )}
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          active
                            ? "bg-[#E05A2B]/20 text-[#E05A2B]"
                            : "bg-white/5 text-slate-400 group-hover:text-[#D4A359]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{link.label}</span>
                      <ArrowRight
                        className={`h-4 w-4 transition-opacity ${
                          active
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Dashboard shortcut */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2 }}
            >
              <Link
                href={dashboardHref}
                onClick={close}
                className={`flex min-h-14 items-center justify-between rounded-2xl px-4 text-sm font-semibold uppercase tracking-[0.14em] transition-all active:scale-[0.98] ${
                  dashboardActive
                    ? "bg-[#E05A2B] text-white shadow-[0_10px_30px_-10px_rgba(224,90,43,0.7)]"
                    : "border border-[#D4A359]/40 bg-[#132024] text-[#D4A359] hover:bg-[#E05A2B] hover:border-[#E05A2B] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Sticky footer actions */}
        <div className="shrink-0 border-t border-[#D4A359]/15 bg-[#0B1315] px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {user ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/profile"
                onClick={close}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D4A359]/30 bg-[#132024] text-xs font-semibold uppercase tracking-wider text-slate-200 transition-colors active:scale-[0.98] hover:border-[#D4A359] hover:text-[#D4A359]"
              >
                <UserCog className="h-4 w-4 text-[#D4A359]" />
                Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  onLogout();
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/5 text-xs font-semibold uppercase tracking-wider text-red-400 transition-colors active:scale-[0.98] hover:bg-red-950/50 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/signin"
                onClick={close}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#D4A359]/50 text-xs font-semibold uppercase tracking-wider text-[#D4A359] transition-colors active:scale-[0.98] hover:bg-[#D4A359] hover:text-black"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#E05A2B] text-xs font-semibold uppercase tracking-wider text-white shadow-[0_10px_30px_-10px_rgba(224,90,43,0.7)] transition-colors active:scale-[0.98] hover:bg-[#c84b20]"
              >
                <Sparkles className="h-4 w-4" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
