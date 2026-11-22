"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import type { ItemStatus, MenuItem } from "@/lib/mock-data";
import {
  dangerBtn,
  inputClass,
  outlineBtn,
  panel,
  primaryBtn,
} from "@/lib/styles";

const selectClass = `${inputClass} [&>option]:bg-[#132024]`;
const STATUSES: ItemStatus[] = ["pending", "approved", "rejected", "inactive"];

export default function AdminItems({
  initialItems,
}: {
  initialItems: MenuItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ItemStatus>("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter(
      (i) =>
        (status === "all" || i.status === status) &&
        (!term ||
          i.itemName.toLowerCase().includes(term) ||
          i.vendorName.toLowerCase().includes(term)),
    );
  }, [items, search, status]);

  const setItemStatus = async (id: string, next: ItemStatus) => {
    try {
      await api.patch(`/api/admin/menu-items/${id}/status`, { status: next });
      setItems((list) =>
        list.map((i) => (i._id === id ? { ...i, status: next } : i)),
      );
      toast.success(`Item marked as ${next}.`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the item.",
      );
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/api/admin/menu-items/${id}`);
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

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by item or vendor"
            aria-label="Search items"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | ItemStatus)}
          aria-label="Filter by status"
          className={`${selectClass} sm:w-48`}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={ShieldCheck}
            title="No items found"
            text="Try a different search or status filter."
          />
        </div>
      ) : (
        <div className={`${panel} mt-5 overflow-x-auto`}>
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#D4A359]/20 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((i) => (
                <tr
                  key={i._id}
                  className="border-b border-[#D4A359]/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-[#0B1315]">
                        <Image
                          src={i.images[0]}
                          alt={i.itemName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{i.itemName}</p>
                        <p className="text-xs text-slate-400">
                          {categoryLabel(i.category)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {i.vendorName}
                    <p className="text-xs text-slate-500">{i.location}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#D4A359]">
                    {formatPrice(i.price)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={i.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {i.status === "pending" ? (
                        <>
                          <Button
                            onClick={() => setItemStatus(i._id, "approved")}
                            className={`${primaryBtn} h-9 px-4`}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setItemStatus(i._id, "rejected")}
                            className={`${dangerBtn} h-9 px-4`}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <select
                          value={i.status}
                          onChange={(e) =>
                            setItemStatus(i._id, e.target.value as ItemStatus)
                          }
                          aria-label={`Change status of ${i.itemName}`}
                          className={`${selectClass} h-9 w-32 text-xs capitalize`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}

                      {confirmId === i._id ? (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => remove(i._id)}
                            className={`${dangerBtn} h-9 px-3`}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setConfirmId(null)}
                            className={`${outlineBtn} h-9 px-3`}
                          >
                            Keep
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setConfirmId(i._id)}
                          className={`${dangerBtn} h-9 px-3`}
                          aria-label={`Delete ${i.itemName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
