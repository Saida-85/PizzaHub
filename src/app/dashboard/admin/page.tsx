import Link from "next/link";
import {
  Clock,
  Receipt,
  ShieldCheck,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { BarChart, BreakdownBars } from "@/components/Charts";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { toItem, toTransaction, toUser } from "@/lib/adapters";
import { categoryLabel } from "@/lib/categories";
import ApiErrorState from "@/components/ApiErrorState";
import { serverApiSafe } from "@/lib/server-api";
import { panel } from "@/lib/styles";

export const metadata = { title: "Admin Overview | PizzaHub" };

export default async function AdminOverviewPage() {
  const [u, m, t] = await Promise.all([
    serverApiSafe<{ users: unknown[] }>("/api/admin/users"),
    serverApiSafe<{ items: unknown[] }>("/api/admin/menu-items"),
    serverApiSafe<{ transactions: unknown[] }>("/api/admin/transactions"),
  ]);
  if (!u.ok) return <ApiErrorState status={u.status} message={u.error} />;
  if (!m.ok) return <ApiErrorState status={m.status} message={m.error} />;
  if (!t.ok) return <ApiErrorState status={t.status} message={t.error} />;
  const USERS = u.data.users.map(toUser);
  const MENU_ITEMS = m.data.items.map((i) => toItem(i));
  const TRANSACTIONS = t.data.transactions.map(toTransaction);

  const vendors = USERS.filter((x) => x.role === "vendor").length;
  const customers = USERS.filter((x) => x.role === "customer").length;
  const pending = MENU_ITEMS.filter((i) => i.status === "pending");
  const itemCount = (s: string) =>
    MENU_ITEMS.filter((i) => i.status === s).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin workspace"
        title="Overview"
        description="A snapshot of everything happening on PizzaHub."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Registered users" value={USERS.length} icon={Users} />
        <StatCard label="Vendors" value={vendors} icon={Store} />
        <StatCard label="Customers" value={customers} icon={Users} />
        <StatCard
          label="Menu items"
          value={MENU_ITEMS.length}
          icon={UtensilsCrossed}
        />
        <StatCard label="Pending items" value={pending.length} icon={Clock} />
        <StatCard
          label="Transactions"
          value={TRANSACTIONS.length}
          icon={Receipt}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart
          title="Menu items by status"
          data={[
            { label: "Approved", value: itemCount("approved") },
            { label: "Pending", value: itemCount("pending") },
            { label: "Rejected", value: itemCount("rejected") },
            { label: "Inactive", value: itemCount("inactive") },
          ]}
        />
        <BreakdownBars
          title="Users by role"
          rows={[
            { label: "Customers", value: customers, color: "#D4A359" },
            { label: "Vendors", value: vendors, color: "#E05A2B" },
            {
              label: "Admins",
              value: USERS.length - vendors - customers,
              color: "#94a3b8",
            },
          ]}
        />
      </div>

      <div className={`${panel} p-5`}>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-white">
            <ShieldCheck className="h-4 w-4 text-[#D4A359]" /> Waiting for
            review
          </h2>
          <Link
            href="/dashboard/admin/items"
            className="text-xs uppercase tracking-wider text-[#D4A359] hover:underline"
          >
            Manage items
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            Nothing to review right now.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[#D4A359]/10">
            {pending.map((i) => (
              <li
                key={i._id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {i.itemName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {i.vendorName} · {categoryLabel(i.category)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
