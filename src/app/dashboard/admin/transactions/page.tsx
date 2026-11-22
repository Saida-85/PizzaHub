import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { toTransaction } from "@/lib/adapters";
import { formatDate, formatPrice } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { panel } from "@/lib/styles";

export const metadata = { title: "Transactions | PizzaHub" };

export default async function TransactionsPage() {
  const { transactions } = await serverApi<{ transactions: unknown[] }>(
    "/api/admin/transactions",
  );
  const rows = transactions.map(toTransaction);

  // Read-only on purpose: there is no edit or status-change action here.
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin workspace"
        title="Transactions"
        description="Subscription payments from vendors. Records are read-only."
      />

      <div className={`${panel} overflow-x-auto`}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#D4A359]/20 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No transactions yet.
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-[#D4A359]/10 last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{t.vendorName}</p>
                    <p className="text-xs text-slate-400">{t.vendorEmail}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-200">
                    {t.plan}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#D4A359]">
                    {formatPrice(t.amount)}{" "}
                    <span className="text-xs text-slate-500">{t.currency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {formatDate(t.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
