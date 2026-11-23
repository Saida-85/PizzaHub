import Link from "next/link";
import { ArrowRight, Check, Clock, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BreakdownBars } from "@/components/Charts";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { toOrder } from "@/lib/adapters";
import { formatDate } from "@/lib/format";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { requireRole } from "@/lib/session";
import { panel, primaryBtn } from "@/lib/styles";

export const metadata = { title: "Dashboard | PizzaHub" };

export default async function CustomerOverviewPage() {
  await requireRole("customer");

  const res = await serverApiSafe<{ orders: unknown[] }>("/api/orders/my");
  if (!res.ok) return <ApiErrorState status={res.status} message={res.error} />;
  const { orders: raw } = res.data;
  const orders = raw.map(toOrder);
  const count = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your pizza nights"
        title="Overview"
        description="A quick look at your orders."
        action={
          <Button asChild className={`${primaryBtn} px-6 py-6`}>
            <Link href="/menu" className="flex items-center gap-2">
              Find a pizza <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total orders"
          value={orders.length}
          icon={ShoppingBag}
        />
        <StatCard label="Pending" value={count("pending")} icon={Clock} />
        <StatCard label="Accepted" value={count("accepted")} icon={Check} />
        <StatCard label="Rejected" value={count("rejected")} icon={X} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownBars
          title="Orders by status"
          rows={[
            { label: "Pending", value: count("pending"), color: "#fbbf24" },
            { label: "Accepted", value: count("accepted"), color: "#34d399" },
            { label: "Rejected", value: count("rejected"), color: "#f87171" },
            { label: "Cancelled", value: count("cancelled"), color: "#94a3b8" },
          ]}
        />

        <div className={`${panel} p-5`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Recent orders
            </h2>
            <Link
              href="/dashboard/orders"
              className="text-xs uppercase tracking-wider text-[#D4A359] hover:underline"
            >
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No orders yet. Find a pizza to get started.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#D4A359]/10">
              {orders.slice(0, 4).map((o) => (
                <li
                  key={o._id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {o.itemName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {o.vendorName} · {formatDate(o.deliveryDate)}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
