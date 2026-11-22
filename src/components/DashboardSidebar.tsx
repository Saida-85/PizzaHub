"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  LogOut,
  Plus,
  Receipt,
  ShoppingBag,
  Sparkles,
  UserCog,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "@/lib/auth-client";

type Role = "customer" | "vendor" | "admin";

interface SidebarUser {
  name: string;
  role: Role;
  image: string | null;
}

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const LINKS: Record<Role, NavLink[]> = {
  customer: [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
  ],
  vendor: [
    {
      label: "Overview",
      href: "/dashboard/vendor",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Menu Items",
      href: "/dashboard/vendor/items",
      icon: UtensilsCrossed,
    },
    { label: "Add Menu Item", href: "/dashboard/vendor/add-item", icon: Plus },
    {
      label: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: ClipboardList,
    },
    {
      label: "Subscription",
      href: "/dashboard/vendor/subscription",
      icon: Crown,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/vendor/profile",
      icon: UserCog,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Manage Menu Items",
      href: "/dashboard/admin/items",
      icon: UtensilsCrossed,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
};

export default function DashboardSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const links = LINKS[user.role];

  const isActive = (l: NavLink) =>
    l.exact
      ? pathname === l.href
      : pathname === l.href || pathname.startsWith(`${l.href}/`);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  return (
    <aside className="md:w-64 md:shrink-0 md:border-r border-b md:border-b-0 border-[#D4A359]/20 bg-[#0B1315]">
      <div className="md:sticky md:top-20 flex md:flex-col gap-4 p-4 md:p-5 md:min-h-[calc(100vh-5rem)]">
        {/* Profile */}
        <div className="hidden md:flex items-center gap-3 pb-4 border-b border-[#D4A359]/20">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#E05A2B] text-white flex items-center justify-center text-sm font-bold">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#D4A359]">
              {user.role} account
            </p>
          </div>
        </div>

        <p className="hidden md:block text-[10px] uppercase tracking-[0.28em] text-slate-500">
          Workspace
        </p>

        {/* Links: horizontal scroll on mobile, vertical on desktop */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {links.map((l) => {
            const Icon = l.icon;
            const active = isActive(l);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 whitespace-nowrap px-3 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-[#E05A2B] text-white"
                    : "text-slate-300 hover:bg-[#132024] hover:text-[#D4A359]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom area (desktop only) */}
        <div className="hidden md:flex flex-col gap-4 mt-auto">
          <div className="border border-[#D4A359]/20 bg-[#132024] p-4">
            <Sparkles className="w-4 h-4 text-[#D4A359]" />
            <p className="mt-2 text-xs font-semibold text-white">
              Made for the neighborhood
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Thanks for being part of PizzaHub.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-400 hover:bg-red-950/40 transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
