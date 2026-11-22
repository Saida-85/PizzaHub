"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PlatformUser, Role } from "@/lib/mock-data";
import { dangerBtn, inputClass, outlineBtn, panel } from "@/lib/styles";

const selectClass = `${inputClass} sm:w-48 [&>option]:bg-[#132024]`;

export default function AdminUsers({
  initialUsers,
}: {
  initialUsers: PlatformUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | Role>("all");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (role === "all" || u.role === role) &&
        (!term ||
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)),
    );
  }, [users, search, role]);

  const toggleBlock = async (user: PlatformUser) => {
    try {
      await api.patch(`/api/admin/users/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });
      setUsers((list) =>
        list.map((u) =>
          u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u,
        ),
      );
      toast.success(
        user.isBlocked
          ? `${user.name} was unblocked.`
          : `${user.name} was blocked.`,
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not update the user.",
      );
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
            placeholder="Search by name or email"
            aria-label="Search users"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "all" | Role)}
          aria-label="Filter by role"
          className={selectClass}
        >
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            icon={Users}
            title="No users found"
            text="Try a different name, email or role."
          />
        </div>
      ) : (
        <div className={`${panel} mt-5 overflow-x-auto`}>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#D4A359]/20 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-[#D4A359]/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-200">
                    {u.role}
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-200">
                    {u.subscriptionPlan}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.isBlocked ? "text-red-300" : "text-emerald-300"
                      }
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role === "admin" ? (
                      <span className="text-xs text-slate-500">Protected</span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => toggleBlock(u)}
                        className={`${u.isBlocked ? outlineBtn : dangerBtn} h-9 px-4`}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
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
