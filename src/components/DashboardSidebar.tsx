"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UserCog,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// Placeholder until Better Auth is connected
const user = { name: "Guest User", role: "customer" as const };

const customerLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Profile Settings", href: "/dashboard/profile", icon: UserCog },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const links = customerLinks; // later: pick links by role

  return (
    <aside className="md:w-64 md:shrink-0 md:border-r border-b md:border-b-0 border-[#D4A359]/20 bg-[#0B1315]">
      <div className="md:sticky md:top-20 flex md:flex-col gap-4 p-4 md:p-5 md:min-h-[calc(100vh-5rem)]">
        {/* Profile */}
        <div className="hidden md:flex items-center gap-3 pb-4 border-b border-[#D4A359]/20">
          <div className="h-10 w-10 rounded-full bg-[#E05A2B] text-white flex items-center justify-center text-sm font-bold">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
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

        {/* Links (horizontal scroll on mobile, vertical on desktop) */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 whitespace-nowrap px-3 py-2.5 text-xs uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-[#E05A2B] text-white"
                    : "text-slate-300 hover:bg-[#132024] hover:text-[#D4A359]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
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
            onClick={() => toast.success("Logged out successfully")}
            className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.14em] text-red-400 hover:bg-red-950/40 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
