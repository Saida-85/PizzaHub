"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/mock-data";
import { dangerBtn, outlineBtn, panel } from "@/lib/styles";

export default function CustomerOrders({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const cancelOrder = async (id: string) => {
    try {
      await api.patch(`/api/orders/${id}/cancel`);
      setOrders((list) =>
        list.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o)),
      );
      toast.success("Order cancelled.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not cancel the order.",
      );
    } finally {
      setConfirmId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        text="Browse the menu and place your first order."
        action={{ href: "/menu", label: "Find a pizza" }}
      />
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o._id} className={`${panel} p-4 sm:p-5`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-[#0B1315]">
              <Image
                src={o.itemImage}
                alt={o.itemName}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1 basis-56">
              <h3 className="truncate font-bold text-white">{o.itemName}</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {o.vendorName} · Delivery {formatDate(o.deliveryDate)}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {o.deliveryAddress}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={o.status} />
              <Button
                variant="outline"
                onClick={() => setOpenId(openId === o._id ? null : o._id)}
                className={`${outlineBtn} h-9 px-4`}
              >
                {openId === o._id ? "Hide" : "Details"}
              </Button>

              {o.status === "pending" &&
                (confirmId === o._id ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => cancelOrder(o._id)}
                      className={`${dangerBtn} h-9 px-4`}
                    >
                      Confirm cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmId(null)}
                      className={`${outlineBtn} h-9 px-4`}
                    >
                      Keep
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setConfirmId(o._id)}
                    className={`${dangerBtn} h-9 px-4`}
                  >
                    Cancel
                  </Button>
                ))}
            </div>
          </div>

          {openId === o._id && (
            <dl className="mt-4 grid gap-3 border-t border-[#D4A359]/20 pt-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  Delivery address
                </dt>
                <dd className="mt-1 text-slate-200">{o.deliveryAddress}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  Requested on
                </dt>
                <dd className="mt-1 text-slate-200">
                  {formatDate(o.createdAt)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">
                  Your message
                </dt>
                <dd className="mt-1 text-slate-200">
                  {o.message || "No special instructions."}
                </dd>
              </div>
            </dl>
          )}
        </li>
      ))}
    </ul>
  );
}
