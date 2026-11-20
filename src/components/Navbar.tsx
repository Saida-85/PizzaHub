"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Pizza, Menu, LayoutDashboard, UserCog, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

interface NavUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "customer" | "vendor" | "admin";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Placeholder state for UI preview
  const isPending = false;
  const user = null as NavUser | null;

  const handleLogout = async () => {
    try {
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const getDashboardHref = (role?: string) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "vendor") return "/dashboard/vendor";
    return "/dashboard";
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    ...(user?.role === "vendor"
      ? [
          { label: "Add Item", href: "/dashboard/vendor/add-item" },
          { label: "Vendor Orders", href: "/dashboard/vendor/orders" },
        ]
      : []),
    ...(user?.role === "admin"
      ? [{ label: "Admin Panel", href: "/dashboard/admin" }]
      : []),
  ];

  const isActive = (href: string) => pathname === href;
  const isDashboardActive = pathname.startsWith("/dashboard");
  const dashboardHref = getDashboardHref(user?.role);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B1315]/95 backdrop-blur-md border-b border-[#D4A359]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* LEFT: Pizza Icon Before Brand Logo Text */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-md border border-[#D4A359]/70 bg-[#132024] flex items-center justify-center group-hover:border-[#E05A2B] transition-colors">
            <Pizza className="w-5 h-5 text-[#E05A2B] -rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-[0.18em] text-white uppercase leading-none">
              Pizza<span className="text-[#D4A359]">Hub</span>
            </span>
            <span className="text-[9px] tracking-[0.28em] text-[#94A3B8] uppercase mt-1">
              Slice of Happiness
            </span>
          </div>
        </Link>

        {/* CENTER: Desktop Navigation Links + Single Dashboard Button */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-xs uppercase tracking-[0.16em] font-medium transition-colors py-1 ${
                isActive(link.href)
                  ? "text-[#D4A359]"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#E05A2B]" />
              )}
            </Link>
          ))}

          <Button
            asChild
            variant="outline"
            className={`rounded-none text-xs uppercase tracking-[0.16em] h-9 px-4 transition-all ${
              isDashboardActive
                ? "bg-[#E05A2B] border-[#E05A2B] text-white hover:bg-[#c84b20] hover:text-white"
                : "border-[#D4A359]/50 bg-[#132024] text-[#D4A359] hover:bg-[#E05A2B] hover:border-[#E05A2B] hover:text-white"
            }`}
          >
            <Link href={dashboardHref} className="flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </nav>

        {/* RIGHT: Auth Actions / Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {isPending ? (
            <div className="h-9 w-28 rounded-sm bg-[#132024] animate-pulse" />
          ) : !user ? (
            <>
              <Link
                href="/signin"
                className="text-xs uppercase tracking-[0.16em] font-medium text-slate-300 hover:text-[#D4A359] transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-[#D4A359]/70 bg-transparent text-[#D4A359] hover:bg-[#E05A2B] hover:border-[#E05A2B] hover:text-white text-xs uppercase tracking-[0.16em] px-5 h-10 transition-all"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-sm border border-[#D4A359]/30 bg-[#132024] hover:border-[#D4A359] transition-colors focus:outline-none">
                  <Avatar className="h-8 w-8 border border-[#D4A359]/50">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="bg-[#E05A2B] text-white text-xs font-bold">
                      {user.name?.slice(0, 2).toUpperCase() || "PH"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-none">
                      {user.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#D4A359] mt-1">
                      {user.role}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 bg-[#132024] border-[#D4A359]/30 text-slate-200 rounded-none"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#D4A359]/20" />

                <DropdownMenuItem
                  asChild
                  className="focus:bg-[#0B1315] focus:text-[#D4A359] cursor-pointer"
                >
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#D4A359]" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  asChild
                  className="focus:bg-[#0B1315] focus:text-[#D4A359] cursor-pointer"
                >
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2"
                  >
                    <UserCog className="w-4 h-4 text-[#D4A359]" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#D4A359]/20" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:bg-red-950/50 focus:text-red-300 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* MOBILE MENU DRAWER */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#132024]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-[#D4A359]" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#0B1315] border-l border-[#D4A359]/20 text-white w-72"
            >
              <SheetHeader className="text-left border-b border-[#D4A359]/20 pb-4">
                <SheetTitle className="text-white tracking-[0.18em] uppercase text-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md border border-[#D4A359]/70 bg-[#132024] flex items-center justify-center">
                    <Pizza className="w-4 h-4 text-[#E05A2B] -rotate-12" />
                  </div>
                  <span>
                    Pizza<span className="text-[#D4A359]">Hub</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-4 mt-6">
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-[#132024] border border-[#D4A359]/20">
                    <Avatar className="h-9 w-9 border border-[#D4A359]/50">
                      <AvatarImage src={user.image || ""} alt={user.name} />
                      <AvatarFallback className="bg-[#E05A2B] text-white text-xs">
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-wider text-[#D4A359]">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-xs uppercase tracking-[0.16em] py-2 border-b border-white/5 ${
                      isActive(link.href) ? "text-[#D4A359]" : "text-slate-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-[#D4A359]/60 bg-[#132024] text-[#D4A359] hover:bg-[#E05A2B] hover:border-[#E05A2B] hover:text-white uppercase tracking-widest text-xs justify-start"
                >
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>

                {!user ? (
                  <div className="flex flex-col gap-3 mt-2">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-[#D4A359] text-[#D4A359] hover:bg-[#D4A359] hover:text-black uppercase tracking-widest text-xs"
                    >
                      <Link href="/signin" onClick={() => setMobileOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="rounded-none bg-[#E05A2B] hover:bg-[#c84b20] text-white uppercase tracking-widest text-xs"
                    >
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-300 py-2"
                    >
                      <UserCog className="w-4 h-4 text-[#D4A359]" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-red-400 py-2 mt-2 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
