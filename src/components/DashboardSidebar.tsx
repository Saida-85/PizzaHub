"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  Crown,
  Heart,
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
    {
      label: "My Orders",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      label: "Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      label: "Profile Settings",
      href: "/dashboard/profile",
      icon: UserCog,
    },
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
    {
      label: "Add Menu Item",
      href: "/dashboard/vendor/add-item",
      icon: Plus,
    },
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
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
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

  const isActive = (link: NavLink) =>
    link.exact
      ? pathname === link.href
      : pathname === link.href || pathname.startsWith(`${link.href}/`);

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
    <aside className="border-b border-[#D4A359]/20 bg-[#0B1315] md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex gap-4 p-4 md:sticky md:top-20 md:min-h-[calc(100vh-5rem)] md:flex-col md:p-5">
        {/* User profile */}
        <div className="hidden items-center gap-3 border-b border-[#D4A359]/20 pb-4 md:flex">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E05A2B] text-sm font-bold text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[#D4A359]">
              {user.role} account
            </p>
          </div>
        </div>

        <p className="hidden text-[10px] uppercase tracking-[0.28em] text-slate-500 md:block">
          Workspace
        </p>

        {/* Role-based navigation */}
        <nav
          aria-label="Dashboard navigation"
          className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 whitespace-nowrap px-3 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-[#E05A2B] text-white"
                    : "text-slate-300 hover:bg-[#132024] hover:text-[#D4A359]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop sidebar footer */}
        <div className="mt-auto hidden flex-col gap-4 md:flex">
          <div className="border border-[#D4A359]/20 bg-[#132024] p-4">
            <Sparkles className="h-4 w-4 text-[#D4A359]" />
            <p className="mt-2 text-xs font-semibold text-white">
              Made for the neighborhood
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Thanks for being part of PizzaHub.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex cursor-pointer items-center gap-3 px-3 py-2 text-left text-xs uppercase tracking-[0.14em] text-red-400 transition-colors hover:bg-red-950/40"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
