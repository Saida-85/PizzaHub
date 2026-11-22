"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { FREE_PLAN_LIMIT, type MenuItem } from "@/lib/mock-data";
import { dangerBtn, outlineBtn, panel } from "@/lib/styles";

export default function VendorItems({
  initialItems,
  plan,
}: {
  initialItems: MenuItem[];
  plan: "free" | "premium";
}) {
  const [items, setItems] = useState(initialItems);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const activeCount = items.filter((i) => i.status === "approved").length;

  const toggleAvailability = async (item: MenuItem) => {
    const next = item.status === "approved" ? "inactive" : "approved";
    if (
      next === "approved" &&
      plan === "free" &&
      activeCount >= FREE_PLAN_LIMIT
    ) {
      toast.error(
        `Free plan allows ${FREE_PLAN_LIMIT} active items. Upgrade to Premium for more.`,
      );
      return;
    }
    try {
      await api.patch(`/api/menu-items/${item._id}`, { status: next });
      setItems((list) =>
        list.map((i) => (i._id === item._id ? { ...i, status: next } : i)),
      );
      toast.success(
        next === "approved"
          ? "Item is active again."
          : "Item hidden from customers.",
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the item.",
      );
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/api/menu-items/${id}`);
      setItems((list) => list.filter((i) => i._id !== id));
      toast.success("Item deleted.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not delete the item.",
      );
    } finally {
      setConfirmId(null);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No menu items yet"
        text="Add your first pizza, side or drink. It goes live after admin approval."
        action={{ href: "/dashboard/vendor/add-item", label: "Add Menu Item" }}
      />
    );
  }

  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-400">
        {plan === "free"
          ? `Free plan: ${activeCount} of ${FREE_PLAN_LIMIT} active items`
          : `Premium: ${activeCount} active items (unlimited)`}
      </p>

      <ul className="space-y-4">
        {items.map((item) => {
          const canToggle =
            item.status === "approved" || item.status === "inactive";
          return (
            <li key={item._id} className={`${panel} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#0B1315]">
                  <Image
                    src={item.images[0]}
                    alt={item.itemName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-white">{item.itemName}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {categoryLabel(item.category)} · {item.location} ·{" "}
                    <span className="font-semibold text-[#D4A359]">
                      {formatPrice(item.price)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                  {item.status === "rejected" && (
                    <p className="mt-1 text-xs text-red-300">
                      Rejected by admin. This item is hidden from customers.
                    </p>
                  )}
                  {item.status === "pending" && (
                    <p className="mt-1 text-xs text-amber-300">
                      Waiting for admin approval.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {item.status === "approved" && (
                    <Button
                      asChild
                      variant="outline"
                      className={`${outlineBtn} h-9 px-3`}
                    >
                      <Link
                        href={`/menu/${item._id}`}
                        aria-label="View public page"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className={`${outlineBtn} h-9 px-3`}
                  >
                    <Link
                      href={`/dashboard/vendor/items/${item._id}/edit`}
                      aria-label="Edit item"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  {canToggle && (
                    <Button
                      variant="outline"
                      onClick={() => toggleAvailability(item)}
                      className={`${outlineBtn} h-9 px-4`}
                    >
                      {item.status === "approved"
                        ? "Set inactive"
                        : "Set active"}
                    </Button>
                  )}
                  {confirmId === item._id ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => remove(item._id)}
                        className={`${dangerBtn} h-9 px-4`}
                      >
                        Confirm delete
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
                      onClick={() => setConfirmId(item._id)}
                      className={`${dangerBtn} h-9 px-3`}
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <Button asChild variant="outline" className={`${outlineBtn} px-6 py-5`}>
          <Link
            href="/dashboard/vendor/add-item"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Menu Item
          </Link>
        </Button>
      </div>
    </div>
  );
}
