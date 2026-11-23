"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Pizza, LayoutDashboard, UserCog, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
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
import MobileMenu from "@/components/MobileMenu";
import { toast } from "sonner";

interface NavUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: "customer" | "vendor" | "admin";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user as NavUser | undefined;
  const userRole = user?.role || "customer";

  const handleLogout = async () => {
    try {
      await signOut();
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
    ...(userRole === "vendor" && user
      ? [
          { label: "Add Item", href: "/dashboard/vendor/add-item" },
          { label: "Vendor Orders", href: "/dashboard/vendor/orders" },
        ]
      : []),
    ...(userRole === "admin" && user
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
                <button className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-sm border border-[#D4A359]/30 bg-[#132024] hover:border-[#D4A359] transition-colors focus:outline-none cursor-pointer">
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
                      {userRole}
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
          <MobileMenu
            open={mobileOpen}
            onOpenChange={setMobileOpen}
            user={user}
            role={userRole}
            isPending={isPending}
            links={navLinks}
            pathname={pathname}
            dashboardHref={dashboardHref}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
