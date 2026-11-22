"use client";

import { useState } from "react";
import Image from "next/image";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/mock-data";
import { dangerBtn, panel, primaryBtn } from "@/lib/styles";

const TABS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export default function VendorOrders({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState<"all" | OrderStatus>("all");

  const decide = async (id: string, status: "accepted" | "rejected") => {
    try {
      await api.patch(`/api/orders/${id}/status`, { status });
      setOrders((list) =>
        list.map((o) => (o._id === id ? { ...o, status } : o)),
      );
      toast.success(
        status === "accepted" ? "Order accepted." : "Order rejected.",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the order.",
      );
    }
  };

  const visible =
    tab === "all" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter orders by status"
      >
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`cursor-pointer border px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors ${
              tab === t.value
                ? "border-[#E05A2B] bg-[#E05A2B]/15 text-white"
                : "border-[#D4A359]/20 text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={ClipboardList}
            title="No orders here"
            text="New customer orders will show up in this list."
          />
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {visible.map((o) => (
            <li key={o._id} className={`${panel} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#0B1315]">
                  <Image
                    src={o.itemImage}
                    alt={o.itemName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-white">{o.itemName}</h3>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {o.customerName} · {o.customerEmail}
                  </p>
                  <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <dt className="uppercase tracking-wider text-slate-500">
                        Delivery date
                      </dt>
                      <dd className="mt-0.5 text-slate-200">
                        {formatDate(o.deliveryDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wider text-slate-500">
                        Address
                      </dt>
                      <dd className="mt-0.5 text-slate-200">
                        {o.deliveryAddress}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="uppercase tracking-wider text-slate-500">
                        Customer message
                      </dt>
                      <dd className="mt-0.5 text-slate-200">
                        {o.message || "No message."}
                      </dd>
                    </div>
                  </dl>
                </div>

                {o.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => decide(o._id, "accepted")}
                      className={`${primaryBtn} h-10 px-5`}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => decide(o._id, "rejected")}
                      className={`${dangerBtn} h-10 px-5`}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
