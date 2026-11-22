import Link from "next/link";
import {
  Check,
  ClipboardList,
  Crown,
  Plus,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, BreakdownBars } from "@/components/Charts";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { toItem, toOrder } from "@/lib/adapters";
import { FREE_PLAN_LIMIT } from "@/lib/mock-data";
import { serverApi } from "@/lib/server-api";
import { getPlan, requireRole } from "@/lib/session";
import { panel, primaryBtn } from "@/lib/styles";

export const metadata = { title: "Vendor Overview | PizzaHub" };

export default async function VendorOverviewPage() {
  const session = await requireRole("vendor");
  const vendor = session.user as unknown as {
    name: string;
    businessName?: string;
  };
  const plan = getPlan(session.user);

  const [{ items: rawItems }, { orders: rawOrders }] = await Promise.all([
    serverApi<{ items: unknown[] }>("/api/menu-items/vendor/my"),
    serverApi<{ orders: unknown[] }>("/api/orders/vendor"),
  ]);
  const items = rawItems.map((i) =>
    toItem(i, vendor.businessName || vendor.name),
  );
  const orders = rawOrders.map(toOrder);

  const active = items.filter((i) => i.status === "approved").length;
  const orderCount = (s: string) => orders.filter((o) => o.status === s).length;
  const itemCount = (s: string) => items.filter((i) => i.status === s).length;
  const isFree = plan === "free";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vendor workspace"
        title="Overview"
        description={`Welcome back, ${vendor.businessName || vendor.name}.`}
        action={
          <Button asChild className={`${primaryBtn} px-6 py-6`}>
            <Link
              href="/dashboard/vendor/add-item"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Menu Item
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total items"
          value={items.length}
          icon={UtensilsCrossed}
        />
        <StatCard label="Active items" value={active} icon={Check} />
        <StatCard
          label="Pending orders"
          value={orderCount("pending")}
          icon={ClipboardList}
        />
        <StatCard
          label="Accepted orders"
          value={orderCount("accepted")}
          icon={Check}
        />
        <StatCard
          label="Current plan"
          value={isFree ? "Free" : "Premium"}
          icon={Crown}
          hint={
            isFree
              ? `${active} of ${FREE_PLAN_LIMIT} active items`
              : "Unlimited items"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          title="Orders by status"
          data={[
            { label: "Pending", value: orderCount("pending") },
            { label: "Accepted", value: orderCount("accepted") },
            { label: "Rejected", value: orderCount("rejected") },
            { label: "Cancelled", value: orderCount("cancelled") },
          ]}
        />
        <BreakdownBars
          title="Menu items by status"
          rows={[
            {
              label: "Approved",
              value: itemCount("approved"),
              color: "#34d399",
            },
            { label: "Pending", value: itemCount("pending"), color: "#fbbf24" },
            {
              label: "Inactive",
              value: itemCount("inactive"),
              color: "#94a3b8",
            },
            {
              label: "Rejected",
              value: itemCount("rejected"),
              color: "#f87171",
            },
          ]}
        />
      </div>

      {isFree && (
        <div
          className={`${panel} flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6`}
        >
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Want to list more items?
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Premium gives you unlimited items, a Premium badge and featured
              placement on the homepage.
            </p>
          </div>
          <Button asChild className={`${primaryBtn} px-6 py-6`}>
            <Link href="/dashboard/vendor/subscription">See plans</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
